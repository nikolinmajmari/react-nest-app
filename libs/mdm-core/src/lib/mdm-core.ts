
type U<T> = T|unknown;

export enum ChannelType{
    private="private",
    group="group"
}

export interface IUser{
  id:string;
  firstName:string;
  lastName:string;
  email:string;
  password:string;
  avatar:string;
}

export interface IChannel{
  id:string;
  alias?:string;
  avatar?:string;
  type:ChannelType;
  createdAt:Date;
  messages?:U<IMessage[]>;
  members?:U<IChannelMember[]>;
  lastMessage?:U<IMessage>;
}

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
  user:U<IUser>;
  settings: ChannelUserSettings;
  createdAt?:Date;
  channel?:U<IChannel>
}

export enum MessageType{
    text="text",
    image="media/image",
    video="media/video",
    recording="media/voice",
    file="media/file"
}

export interface IMessage{
  id:string;
  type:MessageType;
  content:string;
  createdAt:Date;
  sender:IUser;
  channel:IChannel;
}