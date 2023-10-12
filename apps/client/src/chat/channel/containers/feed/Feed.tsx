import { forwardRef } from "react";
import { Align, IChatMessageProgress, IMessageType, Message, MessageFlowType } from "./components/Message";
import React from "react";
import { useChannelFeedMessages } from "../../../../app/hooks/feed";
import { useCurrentUser } from "../../../../app/hooks/auth";
import { MessageType } from "@mdm/mdm-core";
import { IClientMessage } from "../../slices/channel-feed.slice";


const ChannelFeed = forwardRef(function(props,ref){
    const user = useCurrentUser();
    const messages = useChannelFeedMessages();
    const handleAutoScroll = React.useCallback(()=>{
        ref?.current?.scrollIntoView({behavior:"smooth",block: "end",inline: "nearest"})
    },[ref]);
    
    //// handle scroll
    React.useEffect(()=>{
        setTimeout(handleAutoScroll);
    },[]);
    return React.useMemo(()=>(
            <div className="content flex-1">
            {messages.map((message,index)=>
               <ChannelMessageContainer key={index} message={message}/>
            )
                
            }
            <div className="py-4" ref={ref}></div>
        </div>
        ),[messages, ref]
    );
});

export interface IChannelMessageContainerProps{
    message:IClientMessage,
}
export function ChannelMessageContainer({message}:IChannelMessageContainerProps){
    const user = useCurrentUser();
    return (
        <Message 
            content={message.content} 
            media={message.file??message.media} 
            progress={message.progress} 
            timestamp={message?.createdAt?.toString()?.slice(0,10)}
            sender={message.sender} 
            status={IChatMessageProgress.failed} 
            mediaStatus={IChatMessageProgress.failed} 
            onMediaProgressRestart={()=>1 } 
            onMediaProgressCancel={()=>1 } 
            type={message.sender.id!==user.id ? MessageFlowType.received:MessageFlowType.sent} 
            reduced={false}/>
    );
}


export default ChannelFeed;