import { useGetChannelsList, useGetChannelsStateStatus, useLoadChannelsDispatch } from "../../../hooks/channels.hooks";
import ChannelSkeleton from "../../components/channel.skeleton";
import ChannelGroupContainer from "../../components/channel_group_container";
import ChatTile from "../../components/chat_tile";
import React from "react";

export default function ChannelsNavigation(){
    const channels = useGetChannelsList();
    const state = useGetChannelsStateStatus();
    const loadChannels = useLoadChannelsDispatch();
    React.useEffect(()=>{
        if(state==="idle"){
            loadChannels();
        }
    },[state,channels,loadChannels]);

    if(state==="idle" || state==="loading"){
        return <ChannelSkeleton/>
    }
    return (
        <aside className='flex flex-col flex-1 bg-white'>
            <div className='header py-5 bg-white bg-opacity-20 sticky top-0 backdrop-blur-xl flex flex-row items-center h-25'>
                <input className='flex-1 mx-5 shadow-sm outline-none transition-colors rounded-2xl bg-slate-50 focus:bg-teal-50 focus:shadow-md px-4 py-2'/>
            </div>
            <ChannelGroupContainer label="Channels">
               {
                 channels.map((ch)=><ChatTile
                    avatar="NM"
                    label={ch.lastMessage}
                    name={ch.alias!}
                    key={ch.id}
                 />)
               }
            </ChannelGroupContainer>
        </aside>
    );
}