import { useAppDispatch, useAppSelector } from "../app/hooks";
import { loadMessagesThunk, setChannel } from "../chat/slices/channel/channel.slice";
import { setActiveChannel } from "../chat/slices/channels/channels.slice";


export function useGetMessageList(){
    return useAppSelector(root=>root.channel.messages);
}

export function useGetChannelStateStatus(){
     return useAppSelector(root=>root.channel.status);
}

export function useGetChannelId(){
    return useAppSelector(root=>root.channel.id);
}

export function useLoadChannelDispatch(){
    const dispatch = useAppDispatch();
    return (channel:number)=>dispatch(loadMessagesThunk(channel));
}

export function useSetChannelDispatch(){
    const dispatch = useAppDispatch();
    return (channel:number)=>dispatch(setChannel(channel));
}