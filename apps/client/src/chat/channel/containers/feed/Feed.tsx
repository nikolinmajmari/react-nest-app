import { forwardRef } from "react";
import { Align, Message } from "../../../../components/messages/Message";
import React from "react";
import { useChannelFeedMessages } from "../../../../app/hooks/feed";
import { useCurrentUser } from "../../../../app/hooks/auth";
import { MessageType } from "@mdm/mdm-core";


const ChannelFeed = forwardRef(function(props,ref){
    const user = useCurrentUser();
    const messages = useChannelFeedMessages();
    
    //// handle scroll
    React.useEffect(()=>{
        console.log('feed effect');
        setTimeout(
            ()=>ref?.current?.scrollIntoView({behavior:"smooth",block: "end",inline: "nearest"})
        );
    },[]);
    console.log('building');
    return React.useMemo(()=>(
            <div className="content flex-1">
            {messages.map((_,index)=>
                <Message  
                    key={index}
                    content={_.content} 
                    type={MessageType.image}
                    sender={`${_.sender?.firstName} ${_.sender?.lastName}`} 
                    timestamp={_.createdAt?.toString()??'-'} 
                    reduced={false} 
                    align={_.sender?.id===user?.id ? Align.right:Align.left}
                />)
                
            }
            <div className="py-4" ref={ref}></div>
        </div>
        ),[messages, ref, user?.id]
    );
});

export default ChannelFeed;