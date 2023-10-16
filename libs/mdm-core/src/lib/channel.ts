import { IChannelMember, IChannelMemberCreate } from "./channel-member";
import { DeepResolve, PartialDeepResolve, PartialResolve, Resolve } from "./mdm-core";
import { IMessage } from "./message";

export enum ChannelType{
    private="private",
    group="group"
}

export interface IChannel{
  id:string;
  alias:string|null;
  avatar:string|null;
  type:ChannelType;
  createdAt:Date;
  messages:Promise<IMessage[]>;
  members:Promise<IChannelMember[]>;
  lastMessage:Promise<IMessage|null>;
}

export type IPartialChannel = Partial<IChannel>;

export type IResolveChannel  = Resolve<IChannel>;

export type IDeepResolveChannel = DeepResolve<IChannel>;

export type IPartialResolveChannel = PartialResolve<IChannel>;

export type IPartialDeepResolveChannel = PartialDeepResolve<IChannel>;

export interface IChannelCreate extends Omit<IPartialResolveChannel,'members'>{
  members:IChannelMemberCreate[]
}


