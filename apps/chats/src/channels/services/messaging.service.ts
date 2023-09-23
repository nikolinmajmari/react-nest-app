import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import Message from "../entities/message.entity";
import { Repository } from "typeorm";
import Channel from "../entities/channel.entity";
import User from "../../users/entities/user.entity";
import { ChannelMessagesQuery } from "../dto/query.dto";
import { CreateMessageDTO } from "../dto/channel.message.dto";


export interface IUserChannelDTO<T>{
    user: Partial<User>;
    channel: Channel;
    dto:T;
}


@Injectable()
export class MessagingService{

    constructor(
        @InjectRepository(Message)
        private readonly repository: Repository<Message>
    ){}

    async getMessages(channel:Channel,query:any){
        const builder = 
            this.repository.createQueryBuilder('m')
            .select('m')
            .addSelect([
                "user.id","user.firstName",'user.lastName','user.email','user.avatar'
            ])
            .leftJoin('m.sender','user')
            .andWhere('m.channelId = :channelId')
            .setParameter('channelId',channel.id)
        return await builder.getMany();
    }


    async createMessage({user,channel,dto}:IUserChannelDTO<CreateMessageDTO>):Promise<Message>{
        dto.sender = user as User;
        dto.channel = channel;
        const message = this.repository.create(dto as Message);
        return await this.repository.save(message);
    }
}