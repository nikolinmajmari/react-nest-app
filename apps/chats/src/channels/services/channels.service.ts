import { BadRequestException, ForbiddenException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, FindOptionsWhere, Repository } from "typeorm";
import { CreateChannelDTO, UpdateChannelDTO } from "../dto/channel.dto.ts";
import Channel from "../entities/channel.entity";
import ChannelMember from "../entities/channel-member.entity";
import User from "../../users/entities/user.entity";
import { ChannelType, MemberRole } from "@mdm/mdm-core";



@Injectable()
export class ChannelsService{
constructor(
    @InjectRepository(Channel)
    private readonly repository: Repository<Channel>,

    @InjectRepository(ChannelMember)
    private readonly memberRepository: Repository<ChannelMember>
){}


    async findChannels(where:FindOptionsWhere<Channel>={}){
        return this.repository.find({
            where,
             select:{
                members:{
                    user:{
                        avatar:true,
                        id:true,
                        email:true,
                        firstName:true,
                        lastName:true,
                    }
                }
            },
            relations:{
                members:{
                    user: true,
                }
            },
        });
    }

    async findUserChannels(user:Partial<User>){
        const query = this.repository.createQueryBuilder('ch')
        .select(['ch','m','u.id','u.firstName','u.lastName','u.email','u.avatar'])
        .addSelect(
            (qb)=>
            qb.select(`
                case when _ch.type = 'private' then 
                CONCAT(_u."firstName",' ',_u."lastName")
                else _ch.alias end
            `)
            .from("user",'_u')
            .innerJoin('_u.members','_chm')
            .innerJoin('_chm.channel','_ch')
            .where('_chm.channelId = ch.id')
            .andWhere('u.id <> :userId')
            .limit(1),'ch_alias'
        )
        .leftJoin('ch.members','m')
        .leftJoin('m.user','u');
        query.andWhere(
            'ch.id in'+query.subQuery()
            .select('ch.id')
            .from(Channel,'ch')
            .leftJoin('ch.members','m')
            .leftJoin('m.user','u')
            .andWhere('u.id = :userId')
            .getQuery()
        ).setParameter('userId',user.id)
        .cache(false)
       return await query.getMany();
    }


    async createChannelForUser(dto:CreateChannelDTO,user:Partial<User>){
        if(dto.members.findIndex((m)=>m.user===user.id)!=-1){
            throw new BadRequestException("you can not add yourself on a room you are creating");
        }
        /// add current user into channel
        dto.members.push({
            role:MemberRole.admin,
            user:user.id
        });
        const entity = this.repository.create(dto);
        console.log(entity.members);
        /// check if same channel is already created 
        if (entity.type===ChannelType.private && 
            await this.privateChannelOfUsersExists(entity.members[0].user,entity.members[1].user)  
        ){
            throw new BadRequestException('channel is already created between these users');
        }


        /// if channel is private check if there are 
        return await this.repository.save(entity)
    }

    async privateChannelOfUsersExists(user1:string,user2:string){
       
        const query =  this.repository.createQueryBuilder('ch')
                .select(['ch','COUNT(u.id) as users'])
                .leftJoin('ch.members','m')
                .leftJoin('m.user','u')
                .andWhere(
                    new Brackets((qb)=>{
                        qb.orWhere('u.id = :user1Id')
                        .orWhere('u.id = :user2Id')
                    })
                )
                .andWhere('ch.type = :private')
                .setParameter('private',ChannelType.private)
                .setParameter('user1Id',user1)
                .setParameter('user2Id',user2)
                .groupBy('ch.id')
                .having('COUNT(u.id) = 2');
        return (await query.execute()).length > 0;
    }

    async create(channel:CreateChannelDTO){
        const entity = this.repository.create(channel);
        /// if channel is private check if there are 
        return await this.repository.save(entity)
    }

    async findOneChannel(id:string){
        return this.repository.findOneOrFail({
            where:{id},
            select:{
                members:{
                    user:{
                        avatar:true,
                        id:true,
                        email:true,
                        firstName:true,
                        lastName:true,
                    }
                }
            },
            relations:{
                members:{
                    user: true,
                }
            },
            cache:{
                id: 'channel_'+id,
                milliseconds: 5000
            }
        });
    }


    async updateChannel(channel:Channel,user:Partial<User>,dto:UpdateChannelDTO){

        const member = await this.findUserChannelMember(channel.id,user.id);
        if(!member){
           throw new ForbiddenException('You do not have access to this channel');
        }
        if(member.role!==MemberRole.admin && channel.type === ChannelType.group){
           throw new ForbiddenException('You should be an admin to make any modification in this channel');
        }
        return await this.repository.save({ id: channel.id, ...channel,
            members: [
                ...(await channel.members),
                ...dto.members
            ]
        });
    }

    async deleteChannel(id:string){
        const channel = await this.findOneChannel(id);
        this.repository.remove(channel)
    }

    async findUserChannelMember(channelId:string,userId:string){
        return await this.memberRepository.findOneBy({
            channel:{id:channelId},
            user:{id:userId}
        })
    }
}
