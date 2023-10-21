import {IChannelMember, IChannelMemberCreate, IChannelMemberEntity} from "./channel-member";
import { DeepResolve, DeepPartialResolve, PartialResolve, Resolve } from "./mdm-core";
import {IMessage, IMessageEntity} from "./message";

export enum ChannelType{
    private="private",
    group="group"
}

export interface IChannelEntity{
  id:string;
  alias:string|null;
  avatar:string|null;
  type:ChannelType;
  createdAt:Date;
  messages:Promise<IMessageEntity[]>;
  members:Promise<IChannelMemberEntity[]>;
  lastMessage:Promise<IMessageEntity|null>;
}

export type IPartialChannelEntity = Partial<IChannelEntity>;

export type IChannel = DeepResolve<IChannelEntity>;

export type IPartialChannel = DeepPartialResolve<IChannelEntity>;

export interface IChannelCreate extends Omit<IPartialChannel,'members'>{
  members:IChannelMemberCreate[]
}


