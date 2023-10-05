import { useDispatch } from "react-redux";
import { useAppDispatch, useAppSelector } from ".";
import { ChannelType, IChannel } from "@mdm/mdm-core";
import { createChannelThunk, loadChannelsThunk, setActiveChannel } from "../../chat/channels/slices/channels.slice";
import { useCallback } from "react";



export function useChannels(){
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