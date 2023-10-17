import { IChannel, IDeepPartialResolveMessage, IMessageCreateContent, IPartialMessage, IPartialResolveMessage } from "@mdm/mdm-core";
import { useAppDispatch, useAppSelector } from ".";
import { useCurrentUser } from "./auth";
import { useCurrentChannel } from "./channel";
import { useCallback } from "react";
import { addMessage, loadFeedThunk, postMessageThunk } from "../../chat/channel/slices/channel-feed.slice";
import { IFeedMessage } from "../../chat/channel/slices/channel-feed.model";


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
         dispatch( addMessage({
            ...message,
            sender: user
         }));
    }
}

export function usePostMessageThunk(){
    const dispatch = useAppDispatch();
    const user = useCurrentUser();
    const channel = useCurrentChannel();
    if(!channel || !user){
        throw new Error('currentUser and channel must be defined in store');
    }
    return useCallback(
        function(slug:string,message:IDeepPartialResolveMessage){
            console.log('dispatching',slug,message);
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