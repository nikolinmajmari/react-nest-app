import {Injectable} from "@nestjs/common";
import {InjectEntityManager, InjectRepository} from "@nestjs/typeorm";
import Message from "../entities/message.entity";
import {Brackets, EntityManager, FindOptionsWhere, Repository} from "typeorm";
import Channel from "../entities/channel.entity";
import User from "../../users/entities/user.entity";
import {CreateMessageDTO} from "../dto/channel.message.dto";
import {IMessage} from "@mdm/mdm-core";
import Media from "../../media/media.entity";
import {MediaService} from "../../media/services/media.service";


export interface IUserChannelDTO<T> {
    user: Partial<User>;
    channel: Channel;
    dto: T;
}


@Injectable()
export class MessagingService {

    constructor(
        @InjectRepository(Message)
        private readonly repository: Repository<Message>,
        @InjectEntityManager()
        private readonly em: EntityManager,
        @InjectRepository(Media)
        private readonly mediaRepository:Repository<Media>,
        private readonly mediaService:MediaService,
    ) {
    }

    async getMessages(channel: Channel, query: any) {
        const builder =
            this.repository.createQueryBuilder('m')
                .select('m')
                .addSelect([
                    "user.id", "user.firstName", 'user.lastName', 'user.email', 'user.avatar',
                    'media.id', 'media.uri', 'media.type','media.fileName'
                ])
                .leftJoin('m.sender', 'user')
                .leftJoin('m.media', 'media')
                .andWhere('m.channelId = :channelId')
                .addOrderBy('m.createdAt', 'ASC')
                .setParameter('channelId', channel.id)
        return await builder.getMany();
    }


    async createMessage({user, channel, dto}: IUserChannelDTO<CreateMessageDTO>): Promise<Message> {
        const message = this.repository.create(dto as unknown as Message);
        message.channel = Promise.resolve(channel);
        message.sender = Promise.resolve(user as User);
        const saved = await this.repository.save(message as Message);
        channel.lastMessage = Promise.resolve(saved);
        await this.em.save(channel);
        return saved;
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
