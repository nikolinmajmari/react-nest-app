import { useDispatch } from "react-redux";
import { useAppDispatch, useAppSelector } from ".";
import { ChannelType, IChannel } from "@mdm/mdm-core";
import { createChannelThunk, loadChannelsThunk, setActiveChannel } from "../../chat/channels/slices/channels.slice";
import { useCallback } from "react";


export function useChannels(){
    const channels = useChannelsList();
    const setActiveChannel = useDispatchSetActiveChannel();
    const activeChannel = useActiveChannel();
    const status = useChannelsStatus();
    const loadChannels = useDispatchLoadChannels();
    return {channels,activeChannel,status,loadChannels,setActiveChannel};
}

export function useChannelsList(){
    return useAppSelector(root=>root.channels.channels);
}

export function useChannelsStatus(){
    return useAppSelector(root=>root.channels.status);
}

export function useChannelsError(){
    return useAppSelector(root=>root.channels.error);
}

export function useActiveChannel(){
    return useAppSelector(root=>root.channels.activeChannel);
}

export function useDispatchSetActiveChannel(){
     const dispatch = useAppDispatch();
    return useCallback(
        (channel:IChannel)=>dispatch(setActiveChannel(channel.id)),
        [dispatch]
    );
}

export function useDispatchLoadChannels(){
    const dispatch = useAppDispatch();
    return useCallback(
        ()=>dispatch(loadChannelsThunk()),
        [dispatch]
    );
}

export function useDispatchCreateChannel(type:ChannelType){
    const dispatch = useAppDispatch();
    return useCallback(
        function (data:Partial<IChannel>){
            return dispatch(createChannelThunk({
                ...data,
                type: type
            }))
        },
        [dispatch,type]
    );
}