import React from "react";
import { Outlet, useParams } from "react-router-dom";
import { ChannelProvider } from "../channel-context";
import { ChannelSkeleton } from "../../../components/channels/ChannelSkeleton";
import ChannelFeedContainer from "./feed/FeedContainer";
import ChannelNavigation from "./ChannelNavigation";
import { useCurrentChannel, useCurrentChannelStatus, useDispatchLoadChannel } from "../../../app/hooks/channel";

export default function ChannelContainer(){
    const status = useCurrentChannelStatus();
    const channel = useCurrentChannel();
    const loadChannel = useDispatchLoadChannel();
    const { id } = useParams();
    React.useEffect(()=>{
        if(id){
            loadChannel(id);
        }
    },[id,loadChannel]);
    if(status==="idle" || status==="loading" ){
        return <ChannelSkeleton/>
    }
    if(status==="succeeded" && channel !==null && channel!==undefined){
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