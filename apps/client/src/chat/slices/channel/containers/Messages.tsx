import { useGetMessageList } from "../../../../hooks/channel.hooks";
import { forwardRef } from "react";
import { Align, Message } from "../../../components/messages/Message";


const Messages = forwardRef(function(props,ref){
    const messages = useGetMessageList();
    return (
         <div className="content flex-1">
                        {messages.map((_,index)=>
                            <Message  
                                key={index}
                                content={_.content} 
                                sender={"Nikolin Majmari"} 
                                timestamp={"feb 23, 2033"} 
                                reduced={false} 
                                align={Align.left}
                            />)}
                        <div ref={ref}></div>
        </div>
    );
});

export default Messages;