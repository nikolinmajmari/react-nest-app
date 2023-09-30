import { ChannelType, IChannel, IChannelMember } from "@mdm/mdm-core";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { createChannelThunk, loadChannelsThunk, setActiveChannel } from "../chat/channels/slices/channels.slice";
import { useGetCurrentUser } from "./auth.hooks";

export function useGetChannelsList(){
    return useAppSelector(root=>root.channels.channels);
}

export function useGetChannelsStateStatus(){
    return useAppSelector(root=>root.channels.status);
}

export function useLoadChannelsDispatch(){
    const dispatch = useAppDispatch();
    return ()=>dispatch(loadChannelsThunk());
}

export function useSetActiveChannel(){
    const dispatch = useAppDispatch();
    return (id:string)=>dispatch(setActiveChannel(id));
}

export function useGetActiveChannel(){
    return useAppSelector(root=>root.channels.activeChannel);
}

export function useCreateChannel(type:ChannelType){
    const dispatch = useAppDispatch();
    return (data:Partial<IChannel>)=>{
       return dispatch(createChannelThunk({
        ...data,
        type: type
       }));
    }
}