import {BadRequestException, Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {ChannelCreateDTO, ChannelUpdateDTO} from "../dto/channel.dto";
import Channel from "../entities/channel.entity";
import User from "../../users/entities/user.entity";
import {ChannelType, IChannelEntity, MediaType, MemberRole} from "@mdm/mdm-core";
import Media from "../../media/media.entity";
import Message from "../entities/message.entity";
import {MediaService} from "../../media/services/media.service";
import ChannelsRepository from "../repositories/channels.repository";


@Injectable()
export class ChannelsService {
    constructor(
        private readonly repository: ChannelsRepository,
        @InjectRepository(Media)
        private readonly mediaRepository:Repository<Media>,
        private mediaService:MediaService
    ) {
    }
    async createChannelForUser(dto: ChannelCreateDTO, user: Partial<User>) {
        if (dto.members.findIndex((m) => m.user === user.id) != -1) {
            throw new BadRequestException("you can not add yourself on a room you are creating");
        }
        /// add current user into channel
        dto.members.push({
            role: MemberRole.admin,
            user: user.id
        });
        /// check if same channel is already created
        if (dto.type === ChannelType.private &&
            await this.repository.privateChannelWithUsersExists(dto.members[0].user as unknown as string, dto.members[1].user as unknown as string)
        ) {
            throw new BadRequestException('channel is already created between you and selected user');
        }
        const entity = this.repository.create(dto as unknown as IChannelEntity);

        /// if channel is private check if there are
       const saved =  await this.repository.save(entity);
       return this.repository.findUserChannel(entity.id,user);
    }

    async create(channel: ChannelCreateDTO) {
        const entity = this.repository.create(channel as unknown as IChannelEntity);
        /// if channel is private check if there are
        return await this.repository.save(entity)
    }

    async updateChannel(channel: Channel, user: Partial<User>, dto: ChannelUpdateDTO) {
        return await this.repository.save({
            id: channel.id, ...channel,
            members: Promise.resolve([
                ...(await channel.members),
                ...dto.members
            ]),
        });
    }

    async deleteChannel(channel:Channel) {
        const medias = await this.findChannelMedia(channel);
        await this.repository.remove(channel);
        await Promise.all(medias.map(
          m=>this.mediaService.deleteMedia(m)
        ));
    }

    async findChannelMedia(channel:Channel,types?:MediaType[]){
        const query = this.mediaRepository.createQueryBuilder('m')
            .innerJoin(Message, 'msg', 'msg.mediaId = m.id')
            .innerJoin('msg.channel', 'ch')
            .where('ch.id = :channel', {channel: channel.id});
        if(types){
            query.andWhere('m.type in (:...types)',{types})
        }
        return query.getMany();
    }
}
