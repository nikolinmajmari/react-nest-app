import { IChannel } from "@mdm/mdm-core";
import { useAppDispatch, useAppSelector } from ".";
import { loadChannelThunk, setChannel } from "../../chat/channel/slices/channel.slice";
import { useCallback } from "react";



export function useCurrentChannelStatus(){
    return useAppSelector(root=>root.channel.status);
}

export function useCurrentChannel(){
    return useAppSelector(root=>root.channel.channel);
}

export function useDispatchLoadChannel(){
    const dispatch = useAppDispatch();
    return useCallback(
        function (channelId:string){
            dispatch(loadChannelThunk(channelId));
        },
        [dispatch]
    );
}

export function useDispatchSetCurrentChannel(){
    const dispatch = useAppDispatch();
    return useCallback(
        function (channel:IChannel){
            dispatch(setChannel(channel));
        },
        [dispatch]
    )
}