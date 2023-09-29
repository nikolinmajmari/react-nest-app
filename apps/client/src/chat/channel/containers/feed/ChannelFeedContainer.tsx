import React from "react";
import ChannelMessagesSkeleton from "../../../../components/messages/MessagesSkeleton";
import AnimatedOpacity from "../../../../components/AnimatedOpacity";
import  ChannelEntry  from "./ChannelEntry";
import { ChannelContext } from "../../channel-context";
import { useGetChannelMessagesStatus, useLoadMessagesThunk } from "../../../../hooks/messages.hooks";
import ChannelFeed from "./ChannelFeed";

export interface IChannelFeedContainerProps{
    navigation:React.ReactElement
}


export default function ChannelFeedContainer({navigation}:IChannelFeedContainerProps){
    const feedRef = React.useRef<HTMLDivElement>(null);
    const {channel} = React.useContext(ChannelContext)
    const loadMessages = useLoadMessagesThunk();
    const status = useGetChannelMessagesStatus();
    // effects 
    React.useEffect(()=>{
        if(channel && channel.id){
            loadMessages(channel.id);
        }
    },[channel?.id]);


    return (
    <div className="flex flex-1 flex-col">
        <AnimatedOpacity className='flex flex-col flex-1 overflow-y-scroll'>
            { navigation }
            { ( status === "idle" || status === "loading" ) && <ChannelMessagesSkeleton/> }
            { status === "succeeded" && <ChannelFeed ref={feedRef}/>}
        </AnimatedOpacity>
        <ChannelEntry ref={feedRef}/>
    </div>
    );
}