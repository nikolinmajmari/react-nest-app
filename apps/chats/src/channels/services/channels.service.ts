import {BadRequestException, ForbiddenException, Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Brackets, FindOptionsWhere, Repository, SelectQueryBuilder} from "typeorm";
import {ChannelCreateDTO, ChannelMemberCreateDTO, ChannelUpdateDTO} from "../dto/channel.dto";
import Channel from "../entities/channel.entity";
import ChannelMember from "../entities/channel-member.entity";
import User from "../../users/entities/user.entity";
import {ChannelType, IChannel, IChannelEntity, IMedia, IUser, MediaType, MemberRole} from "@mdm/mdm-core";
import Media from "../../media/media.entity";
import Message from "../entities/message.entity";
import {MediaService} from "../../media/services/media.service";


@Injectable()
export class ChannelsService {
    constructor(
        @InjectRepository(Channel)
        private readonly repository: Repository<Channel>,
        @InjectRepository(ChannelMember)
        private readonly memberRepository: Repository<ChannelMember>,
        @InjectRepository(Media)
        private readonly mediaRepository:Repository<Media>,
        private mediaService:MediaService
    ) {
    }

    /**
     * Dynamically selects other member full name as alias of private channel
     * :userId param is required to be added in channelsApi as all checks will be done agains this id
     * @param builder Query builder
     * @param ch channel entity alias
     */
    addSelectDynamicChannelAlias(builder:SelectQueryBuilder<Channel>,ch:string='ch'){
      const sqb = this.repository.manager.createQueryBuilder();
      sqb.select(`CONCAT("_u"."firstName",' ',"_u"."lastName")`)
        .from("user", '_u')
        .innerJoin('_u.members', '_chm')
        .innerJoin('_chm.channel', '_ch')
        .where(`_chm.channelId = ${ch}.id`)
        .andWhere('_u.id <> :userId')
        .limit(1);
      builder.addSelect(`
         case when "${ch}"."type" = 'group'
         then "${ch}"."alias"
         else (${sqb.getQuery()}) end`,
        `${ch}_alias`)
      return sqb;
    }

    andWhereUserChannels(builder: SelectQueryBuilder<Channel>,userId:string,ch:string='ch'){
      builder
        .andWhere(
        'ch.id in' + builder.subQuery()
          .select('_ch.id')
          .from(Channel,'_ch')
          .leftJoin('_ch.members','_m')
          .leftJoin('_m.user','_u')
          .andWhere('_u.id = :userId')
          .getQuery())
        .setParameter('userId',userId);
      return builder;
    }

    createChannelsQueryBuilder(){
      return this.repository.createQueryBuilder('ch')
        .leftJoin('ch.members', 'm')
        .leftJoin('ch.lastMessage', 'lm')
        .leftJoin('m.user', 'u');
    }
    async findUserChannels(user: Partial<User>) {
        const query = this.createChannelsQueryBuilder();
        query.select(["ch", "lm"]);
        this.addSelectDynamicChannelAlias(query);
        this.andWhereUserChannels(query,user.id);
        query.orderBy('lm.createdAt','DESC')
            .cache(false);
        return await query.getMany();
    }

    async findUserChannel(
      id: string,user?:Partial<IUser>,
    ) {
      const query = this.createChannelsQueryBuilder();
      query.select([
        'ch', 'ch.alias',
        'lm',
        'm',
        'u.id','u.firstName','u.lastName','u.email','u.avatar'
      ]);
      this.addSelectDynamicChannelAlias(query);
      query
        .where('ch.id = :id')
        .setParameter('id',id)
        .setParameter('userId',user.id);
      return query.getOneOrFail();
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
            await this.privateChannelOfUsersExists(dto.members[0].user as unknown as string, dto.members[1].user as unknown as string)
        ) {
            throw new BadRequestException('channel is already created between you and selected user');
        }
        const entity = this.repository.create(dto as unknown as IChannelEntity);

        /// if channel is private check if there are
        return await this.repository.save(entity)
    }

    async privateChannelOfUsersExists(user1: string, user2: string) {

        const query = this.repository.createQueryBuilder('ch')
            .select(['ch', 'COUNT(u.id) as users'])
            .leftJoin('ch.members', 'm')
            .leftJoin('m.user', 'u')
            .andWhere(
                new Brackets((qb) => {
                    qb.orWhere('u.id = :user1Id')
                        .orWhere('u.id = :user2Id')
                })
            )
            .andWhere('ch.type = :private')
            .setParameter('private', ChannelType.private)
            .setParameter('user1Id', user1)
            .setParameter('user2Id', user2)
            .groupBy('ch.id')
            .having('COUNT(u.id) = 2');
        return (await query.execute()).length > 0;
    }

    async create(channel: ChannelCreateDTO) {
        const entity = this.repository.create(channel as unknown as IChannelEntity);
        /// if channel is private check if there are
        return await this.repository.save(entity)
    }

    async addChannelMember(channel:ChannelCreateDTO,member:ChannelMemberCreateDTO){


    }

    async findOneOrFail(id:string){
      return await this.repository.findOneOrFail({where:{id}});
    }


    async updateChannel(channel: Channel, user: Partial<User>, dto: ChannelUpdateDTO) {

        const member = await this.findUserChannelMember(channel.id, user.id);
        if (!member) {
            throw new ForbiddenException('You do not have access to this channel');
        }
        if (member.role !== MemberRole.admin && channel.type === ChannelType.group) {
            throw new ForbiddenException('You should be an admin to make any modification in this channel');
        }
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

    async findUserChannelMember(channelId: string, userId: string) {
        return await this.memberRepository.findOneBy({
            channel: {id: channelId},
            user: {id: userId}
        })
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
