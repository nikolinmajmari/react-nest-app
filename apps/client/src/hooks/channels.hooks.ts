import { useAppDispatch, useAppSelector } from "../app/hooks";
import { setActiveChannel } from "../chat/slices/channels/channels.slice";
import loadChannelsThunk from "../chat/slices/channels/thunks/loadChannelsThunk";

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
    return (id:number)=>dispatch(setActiveChannel(id));
}

export function useGetActiveChannel(){
    return useAppSelector(root=>root.channels.activeChannel);
}