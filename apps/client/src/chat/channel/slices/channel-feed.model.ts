/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {DeepPartialResolve, IMessage, IMessageEntity, IPartialMedia, IPartialMessage, IUser} from "@mdm/mdm-core";
import {IAsyncState} from "../../../core/async.state";

/** Global State */

export interface IChannelMessagesState extends IAsyncState {
  messages: (IFeedMessage)[];
  hasMore:boolean,
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
  media?: IFeedMessageMedia|null;
  deleting?:boolean;
}



export enum MediaStatus {
  succeded,
  pending,
  failed
}

export interface IFeedMessageMedia extends IPartialMedia {
  status?: MediaStatus;
  uploadType?: boolean;
  operation?:IOperation;
}

export interface IOperation{
  requestKey:string;
  progress:number;
}
/** Action Argument types  */


export interface IFeedMessageSlug {
  slug: string;
}

export interface IFeedMediaMessageSlug{
  slug:string;
  operationSlug:string;
}

export interface IFeedMessageMediaSlug{
  slug:string;
  operation?:string;
  status:"pending"|"failed";
}

export interface IMessageUploadMediaProgressPayload {
  slug: string;
  progress: number;
}

export interface IMessageStartMediaProgressPayload{
  slug:string;
  requestKey:string;
}
