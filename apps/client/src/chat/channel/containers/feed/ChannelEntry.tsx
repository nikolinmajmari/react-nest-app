import { useAppDispatch } from "../../../../app/hooks";
import React, { forwardRef } from "react";
import { postMessageThunk } from "../../slices/channel-messages.slice";
import { TfiReceipt } from "react-icons/tfi";
import { ChannelContext } from "../../channel-context";
import { MessageType } from "@mdm/mdm-core";
import { useGetCurrentUser } from "../../../../hooks/auth.hooks";


const ChannelEntry = forwardRef(function (props,ref){
    const dispatch = useAppDispatch();
    const user = useGetCurrentUser();
    const [text,setText] = React.useState("");
    const channel = React.useContext(ChannelContext);
    if(!channel){
        throw new Error('');
    }
    const handleAddMessage = ()=>{
        dispatch(postMessageThunk({
            channelId: channel.id,
            user,
            message: {
                content: text,
                type: MessageType.text,
                sender: user
            }
        }));
        setText("");
        setTimeout(
            ()=>{
                ref?.current?.scrollIntoView({
                    behavior:"smooth",
                    block: "end",
                    inline: "nearest"
                });
            }
        )
    }
    return (
         <div className=" bg-slate-100 shadow-y-md bg-opacity-60 sticky bottom-0 backdrop-blur-lg flex flex-row items-center">
            <div className="h-20 flex flex-row items-center justify-between w-full px-6 py-4">
            <input value={text} onChange={e=>setText(e.target.value)} className='bg-white focus:shadow-md px-4 py-2 rounded-lg flex-1 outline-none focus:outline-none'/>
            <button onClick={handleAddMessage} className="mx-2 bg-teal-900 text-white p-4 rounded-full "><TfiReceipt/></button>
            </div>
         </div>
    );
});

export default ChannelEntry;