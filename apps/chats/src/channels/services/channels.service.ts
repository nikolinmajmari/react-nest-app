import {BadRequestException, ForbiddenException, Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Brackets, FindOptionsWhere, Repository, SelectQueryBuilder} from "typeorm";
import {ChannelCreateDTO, ChannelUpdateDTO} from "../dto/channel.dto.ts";
import Channel from "../entities/channel.entity";
import ChannelMember from "../entities/channel-member.entity";
import User from "../../users/entities/user.entity";
import {ChannelType, IChannel, IChannelEntity, IUser, MemberRole} from "@mdm/mdm-core";
import {Simulate} from "react-dom/test-utils";
import select = Simulate.select;


@Injectable()
export class ChannelsService {
    constructor(
        @InjectRepository(Channel)
        private readonly repository: Repository<Channel>,
        @InjectRepository(ChannelMember)
        private readonly memberRepository: Repository<ChannelMember>
    ) {
    }


    async findChannels(where: FindOptionsWhere<Channel> = {}) {
        return this.repository.find({
            where,
            select: {
                members: {
                    user: {
                        avatar: true,
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                    }
                }
            },
            relations: {
                members: {
                    user: true,
                }
            },
        });
    }

    addSelectDynamicChannelAlias(builder:SelectQueryBuilder<Channel>,alias:string='ch'){
      const sqb = this.repository.manager.createQueryBuilder();
      sqb.select(`CONCAT("_u"."firstName",' ',"_u"."lastName")`)
        .from("user", '_u')
        .innerJoin('_u.members', '_chm')
        .innerJoin('_chm.channel', '_ch')
        .where(`_chm.channelId = ${alias}.id`)
        .andWhere('_u.id <> :userId')
        .limit(1);
      builder.addSelect(`
        case when "${alias}"."type" = 'group'
        then "${alias}"."alias"
        else (${sqb.getQuery()}) end`,
        `${alias}_alias`)
      return sqb;
    }

    async findUserChannels(user: Partial<User>) {
        const query = this.repository.createQueryBuilder('ch')

        query.select(["ch", "m", "lm", "u.id", "u.firstName", "u.lastName", "u.email", "u.avatar"])
            .leftJoin('ch.members', 'm')
            .leftJoin('ch.lastMessage', 'lm')
            .leftJoin('m.user', 'u');
        this.addSelectDynamicChannelAlias(query);
        query.andWhere(
            'ch.id in' + query.subQuery()
                .select('ch.id')
                .from(Channel, 'ch')
                .leftJoin('ch.members', 'm')
                .leftJoin('m.user', 'u')
                .andWhere('u.id = :userId')
                .getQuery()
        ).setParameter('userId', user.id)
            .cache(false);
        return await query.getMany();
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
            throw new BadRequestException('channel is already created between these users');
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

    async findUserChannel(id: string,user:IUser) {
        const query =
          this.repository.createQueryBuilder('ch')
            .select(['ch','ch.alias','m','u.id','u.firstName','u.lastName','u.email','u.avatar']);
          this.addSelectDynamicChannelAlias(query);
          query.innerJoin('ch.members','m')
            .innerJoin('m.user','u')
            .where('ch.id = :id')
            .setParameter('id',id)
            .setParameter('userId',user.id);
        return query.getOne();
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

    async deleteChannel(id: string) {
        const channel = await this.findOneOrFail(id);
        await this.repository.remove(channel);
    }

    async findUserChannelMember(channelId: string, userId: string) {
        return await this.memberRepository.findOneBy({
            channel: {id: channelId},
            user: {id: userId}
        })
    }
}
