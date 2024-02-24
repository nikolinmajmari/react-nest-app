import {Injectable} from "@nestjs/common";
import {Repository} from "typeorm";
import Message from "../entities/message.entity";
import {InjectRepository} from "@nestjs/typeorm";
import MessageRecipient from "../entities/message-recipient.entity";
import {CreateMessageDTO} from "../dto/channel.message.dto";
import Channel from "../entities/channel.entity";
import ChannelMember from "../entities/channel-member.entity";




@Injectable()
export default class MessagesRepository extends Repository<Message>{
  constructor(
    @InjectRepository(Message)
    repository: Repository<Message>
  ) {
    super(repository.target,repository.manager,repository.queryRunner);
  }

  async createRecipients(message:Message,members:ChannelMember[]){
    const sender = await message.sender;
    return members.map(m=> new MessageRecipient({
      recipient: m.user,
      delivered: m.user.id===sender.id ? new Date(): null,
      read: m.user.id===sender.id ? new Date(): null,
    }));
  }

  async createChannelMessage(channel:Channel,dto:CreateMessageDTO){
    const message = this.create({
      ...dto,
    } as unknown as Message);
    message.channel = Promise.resolve(channel);
    message.recipients = Promise.resolve(
      this.createRecipients(message,await channel.members)
    );
    return message;
  }

}
