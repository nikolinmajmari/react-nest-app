/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { IPartialMedia, IResolvedMessage} from "@mdm/mdm-core";
import { IAsyncState } from "../../../core/async.state";

/** Global State */

export interface IChannelMessagesState extends IAsyncState {
    messages:(IFeedMessage)[];
};

/** Model state  */

export enum MessageStatus{
    sent,
    pending,
    failed
}

export interface IFeedMessage extends Omit<Partial<IResolvedMessage>,'media'>{
     status?: MessageStatus;
     slug?:string;
     media?:IFeedMessageMedia;
}

export enum MediaStatus{
    sucedded,
    pending,
    failed
}

export interface IFeedMessageMedia extends IPartialMedia{
    status?:MediaStatus;
    uploadType?:boolean;
    progress?:number;
}

/** Action Argument types  */

export interface IFeedMessageCreate extends Omit<IFeedMessage,'sender'|'media'>{
    content:string;
    media?:string;
    sender?:string;
}

export interface IFeedMessageSlug{
    slug:string;
}

export interface IMessageUploadMediaProgressPayload{
    slug:string;
    progress:number;
}
