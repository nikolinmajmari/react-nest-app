import {IChannel, IUser} from "@mdm/mdm-core";
import Channel from "./entities/channel.entity";

export interface IChannelEvent<T>{
  event?:string,
  data:T,
  channel:Channel
}


export interface IUserEvent{
  user:IUser
}

export interface IMessagesDeletedEvent{
  messages:string[]
}

export enum ChannelEvents{
  messageCreated='app.channel.message.created',
  messageRead='app.channel.message.read',
  messageDeleted='app.channel.message.deleted',
  messageTyping = "app.channel.message.typing",
  inChat='app.channel.in_chat',
  leaveChat='app.channel.leave_chat',
}
