import { BadRequestException, ForbiddenException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, Repository } from "typeorm";
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
        const channels = await this.findChannels({
            members:{
                user:{
                    id: user.id
                }
            }
        });
       return channels;
    }


    async createChannelForUser(dto:CreateChannelDTO,user:Partial<User>){
        if(dto.members.findIndex((m)=>m.user===user.id)!=-1){
            throw new BadRequestException("you can not add yourself on a room you are creating");
        }
        /// add current user into channel
        dto.members.push({
            role:MemberRole.admin,
            user:user.id
        })
        return await this.create(dto);
    }

    async create(channel:CreateChannelDTO){
        const entity = this.repository.create(channel);
        console.log(entity);
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
