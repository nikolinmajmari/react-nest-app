/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {IMessage, IPartialMedia, IPartialMessage, IUser} from "@mdm/mdm-core";
import {IAsyncState} from "../../../core/async.state";

/** Global State */

export interface IChannelMessagesState extends IAsyncState {
  messages: (IFeedMessage)[];
}

/** Model state  */

export enum MessageStatus {
  sent,
  pending,
  failed
}

export interface IFeedMessage extends Omit<IPartialMessage, 'media'|"content"|"sender"> {
  status?: MessageStatus;
  slug?: string;
  sender:IUser;
  content:string;
  media?: IFeedMessageMedia;
}

export enum MediaStatus {
  succeded,
  pending,
  failed
}

export interface IFeedMessageMedia extends IPartialMedia {
  status?: MediaStatus;
  uploadType?: boolean;
  progress?: number;
}

/** Action Argument types  */


export interface IFeedMessageSlug {
  slug: string;
}

export interface IMessageUploadMediaProgressPayload {
  slug: string;
  progress: number;
}
