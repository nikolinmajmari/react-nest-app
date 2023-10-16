import { IChannel } from "./channel";
import { Resolve } from "./mdm-core";
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
export type IResolvedMessage = Resolve<IMessage>;
