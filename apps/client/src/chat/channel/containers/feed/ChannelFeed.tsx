import { useGetMessageList } from "../../../../hooks/channel.hooks";
import { forwardRef } from "react";
import { Align, Message } from "../../../../components/messages/Message";
import React from "react";
import { useGetCurrentUser } from "../../../../hooks/auth.hooks";


const ChannelFeed = forwardRef(function(props,ref){
    const messages = useGetMessageList();
    const user = useGetCurrentUser();
    //// handle scroll
    React.useEffect(()=>{
        setTimeout(()=>{
                ref?.current?.scrollIntoView({
                    behavior:"smooth",
                    block: "end",
                    inline: "nearest"
                });
            })
    },[]);
    return (
         <div className="content flex-1">
                        {messages.map((_,index)=>
                            <Message  
                                key={index}
                                content={_.content} 
                                sender={`${_.sender?.firstName} ${_.sender.lastName}`} 
                                timestamp={_.createdAt?.toString()??'-'} 
                                reduced={false} 
                                align={_.sender?.id===user?.id ? Align.right:Align.left}
                            />)}
        <div className="py-4" ref={ref}></div>
        </div>
    );
});

export default ChannelFeed;