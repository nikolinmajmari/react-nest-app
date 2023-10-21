import {IChannel, IChannelEntity} from "./channel";
import { DeepPartialResolve, DeepResolve, PartialResolve, Resolve } from "./mdm-core";
import {IMedia, IMediaEntity} from "./media";
import {IUser} from "./user";

export interface IMessageEntity{
  id:string;
  content:string;
  media:Promise<IMediaEntity|null>;
  createdAt:Date;
  sender:Promise<IUser>;
  channel:Promise<IChannelEntity>;
}

export type IMessage = DeepResolve<IMessageEntity>;

export type IPartialMessage = DeepPartialResolve<IMessageEntity>;

export interface IMessageCreate extends Pick<IMessage,'content'>{
  sender:string;
  media?:string;
}

export type IMessageCreateContent = Pick<IMessageCreate,'content'|'media'>;
