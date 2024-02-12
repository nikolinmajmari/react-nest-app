import {IChannel, IMedia, IMessage,ws} from "@mdm/mdm-core";
import {useAppDispatch, useAppSelector} from "../../../../../app/hooks";
import {useCurrentUser} from "../../../../../app/hooks/auth";
import React, {useCallback} from "react";
import {
  abortMediaProgress,
  addMessage,
  loadFeedThunk,
  postMessageThunk,
} from "../../channel-feed.slice";
import {IFeedMessage, MessageStatus} from "../../channel-feed.model";
import {media as mediaClient} from "../../../../../api.client/client";
import deleteMessagesThunk from "../../thunks/delete-messages.thunk";
import {WebSocketContext} from "../../../../../providers/WebsocketConnectionProvider";



export function useChannelFeedMessages() {
  return useAppSelector(state => state.feed.messages);
}

export function useChannelFeedStatus() {
  return useAppSelector(state => state.feed.status);
}

export function useChannelFeedHasMore():boolean{
  return useAppSelector(state=>state.feed.hasMore);
}

export function useDispatchLoadFeed() {
  const dispatch = useAppDispatch();
  const messages = useChannelFeedMessages();
  return useCallback(function (channel: IChannel) {
    dispatch(loadFeedThunk({
      channelId:channel.id,skip:messages.length,take:10
    }));
  }, [dispatch,messages.length]);
}

export function useDispatchLoadInitialFeed() {
  const dispatch = useAppDispatch();
  return useCallback(function (channel: IChannel) {
    dispatch(loadFeedThunk({
      channelId:channel.id,skip:0,take:10
    }));
  }, [dispatch]);
}



export function useDispatchAddMessage() {
  const dispatch = useAppDispatch();
  const user = useCurrentUser();
  return (message: Pick<IFeedMessage, "content" | "media" | "slug">) => {
    dispatch(addMessage({
      media: message.media, content: message.content, sender: user, slug: message.slug,
    }));
  }
}

export function useAddWsMessage(){
  const dispatch = useAppDispatch();
  return (message: IMessage) => {
    dispatch(addMessage({
      ...message,
      status: MessageStatus.sent
    }));
  }
}

export interface IPostMessageArgs {
  slug: string,
  content: string;
  media?: IPostMediaArgs
  onAfterAdd?: () => void,
  formData?: FormData
}
export interface IPostMediaArgs extends  Pick<IMedia, 'type'|'uri'|'fileName'>{
  formData:FormData
}



export function usePostMessageThunk(channel:string) {
  const dispatch = useAppDispatch();
  const user = useCurrentUser();
  if (!channel || !user) {
    throw new Error('currentUser and channel must be defined in store');
  }
  const wsContext = React.useContext(WebSocketContext);
  return useCallback(function (slug: string, message: Pick<IFeedMessage, 'content' | 'media'|'sender'>) {
    if(wsContext && wsContext.rpcSocket && wsContext.webSocket?.readyState==WebSocket.OPEN){
      const sentMessagePromise =  new Promise<IFeedMessage>((resolve,reject)=>{
        wsContext.rpcSocket?.send<IFeedMessage,unknown>({
          data: {
            ...message,
            media: message.media?.id
          },
          params:{channel},
          event:ws.WsEvents.CHANNEL_MESSAGE_CREATE
        }).then(res=>{
          console.log('resolving ',res);
          resolve(res.result!);
        },err=>reject(err));
      });
      return dispatch(postMessageThunk({
        channelId: channel, message: message, user, slug,promise:sentMessagePromise
      }))
    }
    dispatch(postMessageThunk({
      channelId: channel, message: message, user, slug
    }))
  }, [dispatch, user, channel,wsContext])
}


export interface IAbortMediaArgs{
  slug?:string,
  requestKey?:string,
}
export function useAbortMediaProgress(args:IAbortMediaArgs) {
  const dispatch = useAppDispatch();
  return useCallback(function () {
    mediaClient.storage.get<IMedia,any>(args.requestKey!)!.controller!.abort();
    dispatch(abortMediaProgress({
      slug: args.slug!,
    }));
  }, [dispatch,args.requestKey,args.slug])
}


export function useDeleteMessages(channel:IChannel){
  const dispatch = useAppDispatch();
  return useCallback(function (messagesId:string[]){
    return dispatch(deleteMessagesThunk({
      messagesId: messagesId,
      channel: channel
    }))
  },[channel.id,dispatch]);
}


export * from "./use-post-message";
export * from "./use-retry-post-message";
