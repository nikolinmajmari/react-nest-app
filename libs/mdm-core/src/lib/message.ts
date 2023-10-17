import { IChannel } from "./channel";
import { DeepPartialResolve, DeepResolve, PartialResolve, Resolve } from "./mdm-core";
import { IMedia } from "./media";
import { IPublicUser } from "./user";

export interface IMessage{
  id:string;
  content:string;
  media:Promise<IMedia|null>;
  createdAt:Date;
  sender:Promise<IPublicUser>;
  channel:Promise<IChannel>;
}

export type IPartialMessage = Partial<IMessage>;
export type IResolveMessage = Resolve<IMessage>;
export type IPartialResolveMessage = PartialResolve<IMessage>;
export type IDeepPartialResolveMessage = DeepPartialResolve<IMessage>;
export interface IMessageCreate extends Pick<IMessage,'content'>{
  sender:string;
  media?:string;
}

export type IMessageCreateContent = Pick<IMessageCreate,'content'|'media'>;