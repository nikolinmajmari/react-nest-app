import {Injectable} from "@nestjs/common";
import {InjectEntityManager, InjectRepository} from "@nestjs/typeorm";
import Message from "../entities/message.entity";
import {Brackets, EntityManager, FindOptionsWhere, Repository} from "typeorm";
import Channel from "../entities/channel.entity";
import User from "../../users/entities/user.entity";
import {CreateMessageDTO} from "../dto/channel.message.dto";
import {IMessage, IPartialUser, IUser} from "@mdm/mdm-core";
import Media from "../../media/media.entity";
import {MediaService} from "../../media/services/media.service";
import {skip} from "rxjs";
import {use} from "passport";
import MessageRecipient from "../entities/message-recipient.entity";
import ChannelMember from "../entities/channel-member.entity";
import MessagesRepository from "../repositories/messages.repository";


export interface IUserChannelDTO<T> {
    user: IPartialUser;
    channel: Channel;
    dto: T;
}


@Injectable()
export class MessagingService {

    constructor(
        private readonly repository: MessagesRepository,
        @InjectEntityManager()
        private readonly em: EntityManager,
        private readonly mediaService:MediaService,
    ) {
    }

    createMessageQueryBuilder(){
      return this.repository.createQueryBuilder('m')
        .select('m')
        .addSelect([
          "user.id", "user.firstName", 'user.lastName', 'user.email', 'user.avatar',
          'media.id', 'media.uri', 'media.type','media.fileName'
        ])
        .leftJoin('m.sender', 'user')
        .leftJoin('m.media', 'media');
    }

    async getMessages(channel: Channel, query: any) {
        const builder =
            this.createMessageQueryBuilder()
                .andWhere('m.channelId = :channelId')
                .addOrderBy('m.createdAt', 'DESC')
                .setParameter('channelId', channel.id);
        if(query.skip){
          builder.skip(query.skip);
        }
        if(query.take){
          builder.take(query.take);
        }
        const result = await builder.getMany();
        return result.reverse();
    }

    async getMessage(id:string){
      return this.createMessageQueryBuilder()
        .where('m.id = :id',{'id':id})
        .getOneOrFail();
    }


    async createChannelMessage(channel:Channel,payload:CreateMessageDTO): Promise<Message> {
        const message = await this.repository.save(
          await this.repository.createChannelMessage(channel,payload)
        );
        console.log(message);
        channel.lastMessage = Promise.resolve(message);
        await this.em.save(channel);
        return message;
    }


    async findOrFail(messageId:string,channel?:Channel){
      const more = {};
      if(channel){
        more['channel'] = {id:channel.id};
      }
      return await this.repository.findOneOrFail({
        where:{
          id:messageId,
          ...more
        }
      })
    }

    async deleteMessage(message:Message){
      return await this.repository.remove(message);
    }

    async deleteMessages(messagesId:string[],channel?:Channel){
      const runner = this.em.connection.createQueryRunner('master');
      await runner.connect();
      const medias = await runner.manager.createQueryBuilder(Media,'m')
        .select('m')
        .innerJoin(Message,'msg','msg.mediaId = m.id')
        .innerJoin('msg.channel','ch')
        .where('ch.id = :channel',{channel:channel.id})
        .andWhere('msg.id IN (:...messagesId)',{messagesId:messagesId})
        .getMany();
      await  runner.startTransaction();
      try{

        const query =
          runner
            .connection
            .createQueryBuilder()
            .delete()
            .from(Message)
            .where('id in (:...messagesId)')
            .setParameter('messagesId',messagesId);
        console.log(query.getSql());
        const deleteResult = await query.execute();
        await runner.manager.remove(medias);
        medias.forEach((media)=>this.mediaService.deleteMediaFileStorage(media,true));
        await runner.commitTransaction();
        return deleteResult;
      }catch (e){
        await runner.rollbackTransaction();
        console.log(e);
        throw e;
      }finally {
        await runner.release();
      }
    }
}
