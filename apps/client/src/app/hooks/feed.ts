import { IChannel, IDeepPartialResolveMessage, IMedia, IMessageCreateContent, IPartialMessage, IPartialResolveMessage, MediaType } from "@mdm/mdm-core";
import { useAppDispatch, useAppSelector } from ".";
import { useCurrentUser } from "./auth";
import { useCurrentChannel } from "./channel";
import { useCallback } from "react";
import { addMessage, completeMediaProgress, failMediaProgress, loadFeedThunk, postMessageThunk, startMediaProgress, updateMediaProgress } from "../../chat/channel/slices/channel-feed.slice";
import { IFeedMessage, MediaStatus } from "../../chat/channel/slices/channel-feed.model";
import { useDispatch } from "react-redux";

import { media as mediaClient } from "../../api.client/client";


export function useChannelFeedMessages(){
    return useAppSelector(state=>state.feed.messages);
}

export function useChannelFeedStatus(){
    return useAppSelector(state=>state.feed.status);
}

export function useChannelFeedError(){
    return useAppSelector(state=>state.feed.error);
}

export function useDispatchLoadFeed(){
    const dispatch = useAppDispatch();
    return useCallback(function(channel:IChannel){
        dispatch(loadFeedThunk(channel.id));
    },[dispatch]);
}


export function useDispatchAddMessage(){
    const dispatch = useAppDispatch();
    const user = useCurrentUser();
    return (message:Partial<IFeedMessage>)=>{
        dispatch( addMessage({...message,sender: user}));
    }
}

export interface IPostMediaMessageArgs {
    slug:string,
    content:string;
    media: Pick<IMedia,"type"|"uri">
    onAfterAdd?:()=>void,
    formData:FormData
}

/**
 * 
 * @returns 
 */
export function usePostMediaMessage(){
    const dispatch = useDispatch();
    const addMessage = useDispatchAddMessage();
    const user = useCurrentUser();
    const postMessage = usePostMessageThunk();
    return useCallback(
        async function(args:IPostMediaMessageArgs){
        const {slug,content,media,formData,onAfterAdd} = args;
        addMessage({
            media: { ...media, status: MediaStatus.pending },
            slug: slug, 
            content: content, 
            sender: user,
        });
        if(onAfterAdd){
            onAfterAdd();
        }
        dispatch(startMediaProgress({slug}));
        try{
            const res = await mediaClient.upload(formData,(e)=>{
                dispatch(updateMediaProgress({slug,progress:e.progress??0}))
            });
            const media = await mediaClient.get(res.id);
            completeMediaProgress({slug}); 
            postMessage(slug,{ 
                content: content,
                media: media,
            });    
        }catch(e){
            failMediaProgress({slug});
        }   
    },[user,postMessage,dispatch,addMessage]);
}

export function usePostMessageThunk(){
    const dispatch = useAppDispatch();
    const user = useCurrentUser();
    const channel = useCurrentChannel();
    if(!channel || !user){
        throw new Error('currentUser and channel must be defined in store');
    }
    return useCallback(
        function(slug:string,message:Pick<IFeedMessage,'content'|'media'>){
            dispatch(postMessageThunk({
                channelId: channel?.id,
                message: message,
                user,
                slug
            }))
        },
        [dispatch,user,channel]
    )
}