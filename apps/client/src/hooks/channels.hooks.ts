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

export function useSetActiveChannel(id:number){
    const dispatch = useAppDispatch();
    return ()=>dispatch(setActiveChannel(id));
}