import { useGetChannel, useGetChannelStateStatus, useLoadChannelDispatch } from "./../../../hooks/channel.hooks";
import React from "react";
import { Outlet, useParams } from "react-router-dom";
import { ChannelProvider } from "../channel-context";
import { ChannelSkeleton } from "../../../components/channels/ChannelSkeleton";
import ChannelFeedContainer from "./feed/ChannelFeedContainer";
import ChannelNavigation from "./ChannelNavigation";

export default function ChannelContainer(){
    const status = useGetChannelStateStatus();
    const loadChannel = useLoadChannelDispatch();
    const { id } = useParams();
    React.useEffect(()=>{
        if(id){
            loadChannel(id);
        }
    },[id]);
    if(status==="idle"||status==="loading"){
        return <ChannelSkeleton/>
    }
    if(status==="succeeded"){
        return (
        <ChannelProvider>
            <ChannelFeedContainer navigation={<ChannelNavigation/>}/>
            <Outlet/>
        </ChannelProvider>)
    }
    return <div>
        "error";
    </div>
    
}