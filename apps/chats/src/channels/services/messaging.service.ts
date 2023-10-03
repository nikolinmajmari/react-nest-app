import { Injectable } from "@nestjs/common";
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import Message from "../entities/message.entity";
import { EntityManager, Repository } from "typeorm";
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
        private readonly repository: Repository<Message>,
        @InjectEntityManager()
        private readonly em:EntityManager
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
        const saved =  await this.repository.save(message);
        channel.lastMessage = saved;
        await this.em.save(channel);
        return saved;
    }
}