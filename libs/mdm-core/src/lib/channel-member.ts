
import { IChannel } from "./channel";
import { PartialDeepResolve, PartialResolve, Resolve } from "./mdm-core";
import { IPublicUser } from "./user";

export enum MemberRole{
  admin="admin",
  member="member"
}

export interface ChannelUserSettings {
    muteNotifications?:boolean;
}

export interface IChannelMember{
  id:string;
  role:MemberRole;
  user:IPublicUser;
  settings: ChannelUserSettings;
  createdAt:Date;
  channel:Promise<IChannel>
}

export type IPartialChannelMember = Partial<IChannelMember>;

export type IResolveChannelMember = Resolve<IChannelMember>;

export type IPartialResolveChannelMember = PartialResolve<IChannelMember>;

export interface IChannelMemberCreate extends Omit<IPartialResolveChannelMember,"user">{ 
    user:string;
}
