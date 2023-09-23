import { useGetChannel, useGetChannelStateStatus, useLoadChannelDispatch } from "./../../../hooks/channel.hooks";
import React from "react";
import { Outlet, useParams } from "react-router-dom";
import { ChannelProvider } from "../channel-context";
import { ChannelSkeleton } from "../../../components/channels/ChannelSkeleton";
import ChannelFeedContainer from "./feed/ChannelFeedContainer";
import ChannelNavigation from "./ChannelNavigation";

export default function ChannelContainer(){
    const stateStatus = useGetChannelStateStatus();
    const loadChannel = useLoadChannelDispatch();
    const channel = useGetChannel();
    const { id } = useParams();
    React.useEffect(()=>{
        if(id){
            loadChannel(id);
        }
    },[id]);
    if(stateStatus==="idle"||stateStatus==="loading"){
        return <ChannelSkeleton/>
    }
    if(stateStatus==="succeeded" && channel){
        return (
        <ChannelProvider channel={channel}>
            <ChannelFeedContainer navigation={<ChannelNavigation/>}/>
            <Outlet/>
        </ChannelProvider>)
    }
    return <div>
        "error";
    </div>
    
}