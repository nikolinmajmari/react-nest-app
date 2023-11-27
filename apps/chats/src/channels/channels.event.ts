import {IChannel} from "@mdm/mdm-core";
import Channel from "./entities/channel.entity";

export interface IChannelEvent<T>{
  event?:string,
  data:T,
  channel:Channel
}

export enum ChannelEvents{
  messageCreated='app.channel.message.created',
  messageRead='app.channel.message.read',
  messageDeleted='app.channel.message.deleted',
  inChat='app.channel.in_chat',
  leaveChat='app.channel.leave_chat',
}
