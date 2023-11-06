import {IChannel, IMedia} from "@mdm/mdm-core";
import {useAppDispatch, useAppSelector} from ".";
import {useCurrentUser} from "./auth";
import {useCallback} from "react";
import {
  abortMediaProgress,
  addMessage,
  completeMediaProgress,
  loadFeedThunk,
  postMessageThunk, restartMediaProgress,
  startMediaProgress,
  updateMediaProgress
} from "../../chat/channel/slices/channel-feed.slice";
import {IFeedMessage, IFeedMessageMedia, MediaStatus} from "../../chat/channel/slices/channel-feed.model";
import {useDispatch} from "react-redux";

import {media, media as mediaClient} from "../../api.client/client";
import deleteMessagesThunk from "../../chat/channel/slices/thunks/deleteMessagesThunk";


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
  console.log('hey from ',messages.length);
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

/**
 *
 * @returns
 */
export function usePostMessage(channel:string) {
  const dispatch = useDispatch();
  const addMessage = useDispatchAddMessage();
  const user = useCurrentUser();
  const postMessageThunk = usePostMessageThunk(channel);
  return useCallback(async function (args: IPostMessageArgs) {
    const {slug, content, media, onAfterAdd} = args;
    if(!args.media){
      postMessageThunk(slug, {content});
      if (onAfterAdd) {
        onAfterAdd();
      }
      return;
    }
    addMessage({
      media: {
        uri:media?.uri,
        type: media?.type,
        fileName: media?.fileName,
        status: MediaStatus.pending
      },
      slug: slug,
      content: content
    });
    if (onAfterAdd) {
      onAfterAdd();
    }
    try {
      const [key, request] = mediaClient.upload(args.media.formData);

      dispatch(startMediaProgress({slug: slug,requestKey:key}));
      const uploadedMedia = await request.reply({
        onUploadProgress: (e) => {
          dispatch(updateMediaProgress({slug, progress: e.progress ?? 0}))
        },
      });
      completeMediaProgress({slug});
      postMessageThunk(slug, { content: content, media: uploadedMedia});
    } catch (e) {
      dispatch(abortMediaProgress({slug}));
    }
  }, [user, postMessage, dispatch, addMessage,channel]);
}

export function useRetryPostMessage(channel:string,message:IFeedMessage){
  const slug= message.slug!;
  const postMessage = usePostMessageThunk(channel);
  const dispatch = useAppDispatch();
  return useCallback(async function (){
    if(message.media &&  message.media.operation){
      const request = mediaClient.storage.get<IMedia>(message.media.operation.requestKey)!;
      dispatch(restartMediaProgress({slug: message.slug!}));
      const uploadedMedia = await request.reply({
        onUploadProgress: (e) => {
          dispatch(updateMediaProgress({slug:message.slug!, progress: e.progress ?? 0}))
        },
      });
      completeMediaProgress({slug});
      postMessage(slug,{
        content: message.content,
        media: uploadedMedia
      })
    }else{
      postMessage(slug,{
        content: message.content,
      })
    }
  },[message,channel])
}

export function usePostMessageThunk(channel:string) {
  const dispatch = useAppDispatch();
  const user = useCurrentUser();
  if (!channel || !user) {
    throw new Error('currentUser and channel must be defined in store');
  }
  return useCallback(function (slug: string, message: Pick<IFeedMessage, 'content' | 'media'>) {
    dispatch(postMessageThunk({
      channelId: channel, message: message, user, slug
    }))
  }, [dispatch, user, channel])
}


export function useAbortMediaProgress() {
  const dispatch = useAppDispatch();
  return useCallback(function (slug:string,requestKey:string) {
    mediaClient.storage.get<IMedia>(requestKey)!.controller!.abort();
    dispatch(abortMediaProgress({slug}));
  }, [dispatch])
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
