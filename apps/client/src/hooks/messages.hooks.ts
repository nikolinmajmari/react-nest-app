import { IMessage } from "@mdm/mdm-core";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { addMessage,loadMessagesThunk,markMessageFailed,markMessageSent,postMessageThunk } from "../chat/channel/slices/channel-messages.slice";
import { useGetCurrentUser } from "./auth.hooks";



export function useGetChannelMessages(){
    return useAppSelector(state=>state.channelMessages.messages);
}

export function useGetChannelMessagesStatus(){
    return useAppSelector(state=>state.channelMessages.status);
}

export function useGetChannelMessagesError(){
    return useAppSelector(state=>state.channelMessages.error);
}


export function useLoadMessagesThunk(){
    const dispatch = useAppDispatch();
    return (channelId:string)=>{
        dispatch(loadMessagesThunk(channelId));
    }
}

export function usePostMessageThunk(){
    const dispatch = useAppDispatch();
    const user = useGetCurrentUser();
    return (channelId:string,message:IMessage)=>{
        dispatch(postMessageThunk({
            channelId: channelId,
            message: message,
            user
        }));
    }
}