import { useAppDispatch } from "../../../../app/hooks";
import React, { FormEventHandler, forwardRef } from "react";
import { postMessageThunk } from "../../slices/channel-feed.slice";
import { TfiReceipt } from "react-icons/tfi";
import { ChannelContext } from "../../channel-context";
import { MessageType } from "@mdm/mdm-core";
import { useCurrentUser } from "../../../../app/hooks/auth";
import { usePostMessageThunk } from "../../../../app/hooks/feed";


const ChannelEntry = forwardRef(function (props,ref){
    const postMessage = usePostMessageThunk();
    const user = useCurrentUser();
    const [text,setText] = React.useState("");
    const {channel} = React.useContext(ChannelContext);
    const handleAddMessage = ()=>{
        postMessage({
            content: text,
            type: MessageType.text,
            sender: user,
        })
        setText("");
        setTimeout(
            ()=>ref?.current?.scrollIntoView({ behavior:"smooth", block: "end", inline: "nearest" })
        )
    }
    const handleFormSubmit:FormEventHandler<HTMLFormElement> = (e)=>{
        e.preventDefault();
        handleAddMessage();
    }
    if(!channel){
        throw new Error('');
    }
    return (
         <form onSubmit={handleFormSubmit}>
            <div className=" bg-slate-100 shadow-y-lg bg-opacity-60 sticky bottom-0 backdrop-blur-lg flex flex-row items-center
                dark:bg-slate-800
            ">
                <div className="h-20 flex flex-row items-center justify-between w-full px-6 py-4">
                <input value={text} onChange={e=>setText(e.target.value)} className='bg-white focus:shadow-md px-4 py-2 rounded-lg flex-1 outline-none focus:outline-none
                    dark:bg-gray-700 dark:text-white
                '/>
                <button type="submit" className="mx-2 bg-teal-900 text-white p-4 rounded-full "><TfiReceipt/></button>
                </div>
            </div>
         </form>
    );
});

export default ChannelEntry;