import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import User from "../../users/entities/user.entity";
import { UpdateChannelSettingsDTO, UpdateChannelmemberDTO } from "../dto/channel.member.dto";
import ChannelMember from "../entities/channel-member.entity";
import Channel from "../entities/channel.entity";


@Injectable()
export class MembersService{

    constructor(
        @InjectRepository(ChannelMember)
        private readonly repository: Repository<ChannelMember>
    ){}


    async findMember(id:string){
        return await this.repository.findOneByOrFail({
            id: id
        });
    }

    async findUserMemberById(id:string,user:Partial<User>){
        return await this.repository.findOneByOrFail({
            id : id,
            user:{ id:user.id }
        });
    }

    async findUserMemberByChannel(channel:Channel,user:Partial<User>){
        return await this.repository.findOneByOrFail({
            channel:{id:channel.id},user:{id:user.id}
        })
    }


    async findChannelMember(id:string){
        return await this.repository.findOneByOrFail({id:id});
    }

    async updateChannelMemberSettings(member:ChannelMember,dto:UpdateChannelSettingsDTO){
        member.settings = {
            ...member.settings,...dto
        };
        return await this.repository.save(member);
    }

    async updateChannelMember(member:ChannelMember,dto:UpdateChannelmemberDTO){
        return await this.repository.save({
            ...member,
            ...dto
        });
    }


    async removeMember(member:ChannelMember){
        return await this.repository.remove(member);
    }

}