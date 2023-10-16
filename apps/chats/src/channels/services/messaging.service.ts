import { Injectable } from "@nestjs/common";
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import Message from "../entities/message.entity";
import { EntityManager, Repository } from "typeorm";
import Channel from "../entities/channel.entity";
import User from "../../users/entities/user.entity";
import { ChannelMessagesQuery } from "../dto/query.dto";
import { CreateMessageDTO } from "../dto/channel.message.dto";
import { IMessage } from "@mdm/mdm-core";


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
                "user.id","user.firstName",'user.lastName','user.email','user.avatar',
                'media.id','media.uri','media.type'
            ])
            .leftJoin('m.sender','user')
            .leftJoin('m.media','media')
            .andWhere('m.channelId = :channelId')
            .addOrderBy('m.createdAt','ASC')
            .setParameter('channelId',channel.id)
        return await builder.getMany();
    }


    async createMessage({user,channel,dto}:IUserChannelDTO<CreateMessageDTO>):Promise<Message>{
        const message = this.repository.create(dto as unknown as IMessage);
        message.channel = Promise.resolve( channel);
        message.sender = Promise.resolve(user as User);
        const saved =  await this.repository.save(message);
        channel.lastMessage = Promise.resolve(saved);
        await this.em.save(channel);
        return saved;
    }
}