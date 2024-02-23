
import {IChannelEntity} from "./channel";
import {DeepPartialResolve, DeepResolve} from "./mdm-core";
import { IUser} from "./user";

export enum MemberRole{
  admin="admin",
  member="member"
}

export interface ChannelUserSettings {
    muteNotifications?:boolean;
}


export interface IChannelMemberEntity{
  id:string;
  role:MemberRole;
  user:IUser;
  settings: ChannelUserSettings;
  createdAt:Date;
  channel:Promise<IChannelEntity>
}

export type IChannelMember = DeepResolve<IChannelMemberEntity>;

export type IPartialChannelMember = DeepPartialResolve<IChannelMemberEntity>;

export interface IChannelMemberCreate extends Omit<IPartialChannelMember,"user">{
    user:string;
}
