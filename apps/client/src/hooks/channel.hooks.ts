import { IChannel } from "@mdm/mdm-core";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { loadMessagesThunk } from "../chat/channel/slices/channel-messages.slice";
import { loadChannelThunk, setChannel } from "../chat/channel/slices/channel.slice";


export function useGetMessageList(){
    return useAppSelector(root=>root.channelMessages.messages);
}

export function useGetChannelStateStatus(){
     return useAppSelector(root=>root.channel.status);
}

export function useGetChannelId(){
    return useAppSelector(root=>root.channel.channel?.id);
}

export function useGetChannel(){
    return useAppSelector(root=>root.channel.channel);
}

export function useLoadMessagesDispatch(){
    const dispatch = useAppDispatch();
    return (channelId:string)=>dispatch(loadMessagesThunk(channelId));
}

/**
 * 
 * @returns a function that dispatches an event to load channel with specific id on the store
 */
export function useLoadChannelDispatch(){
    const dispatch = useAppDispatch();
    return (channelId:string)=>{
        return dispatch(loadChannelThunk(channelId));
    }
}

export function useSetChannelDispatch(){
    const dispatch = useAppDispatch();
    return (channel:IChannel)=>{
        dispatch(setChannel(channel));
    }
}