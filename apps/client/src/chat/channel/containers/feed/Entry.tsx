import React, { FormEventHandler, forwardRef } from "react";
import { TfiReceipt } from "react-icons/tfi";
import { ChannelContext } from "../../channel-context";
import { MessageType } from "@mdm/mdm-core";
import { useCurrentUser } from "../../../../app/hooks/auth";
import { usePostMessageThunk } from "../../../../app/hooks/feed";
import { GrAttachment } from "react-icons/gr";


const ChannelEntry = forwardRef(function (props,ref){
    const user = useCurrentUser();
    const postMessage = usePostMessageThunk();
    const {channel} = React.useContext(ChannelContext);

    const [content,setContent] = React.useState('');
    const [media,setMedia] = React.useState<string|null>(null);

    const contentRef = React.useRef<HTMLDivElement>();
    const mediaRef = React.useRef<HTMLInputElement>();

    const handleMediaClick = ()=>{
        console.log(mediaRef.current);
        mediaRef.current?.click();
    }

    const handleFileChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
        const path = e.target.value.split('\\').pop();
        if(path){
            setMedia(path);
        }
    }

    const handleFormSubmit:FormEventHandler<HTMLFormElement> = (e)=>{
        e.preventDefault();
        postMessage({ content: contentRef.current?.innerText, type: MessageType.text, sender: user,})
        setTimeout(
            ()=>ref?.current?.scrollIntoView({ behavior:"smooth", block: "end", inline: "nearest" })
        )
    }
    const handleResize = (target:HTMLDivElement)=>{
        target.style.height = "1px";
        target.style.height = `${Math.min(Math.max(target?.scrollHeight,20),160)}px`;
        setContent(target.innerHTML);
    }
    if(!channel){
        throw new Error('');
    }
    return (
         <form onSubmit={handleFormSubmit}>
            <input onChange={handleFileChange} type="file" ref={mediaRef} className="hidden"></input>
            <div className=" bg-slate-100 shadow-y-lg bg-opacity-60 sticky bottom-0 backdrop-blur-lg flex flex-col items-start
                dark:bg-slate-800
            ">
                {
                    media && <div>{media}</div>
                }
             <div className="flex flex-row items-center justify-between w-full px-2 py-4">
                <EntryOptionButton onClick={handleMediaClick}>
                    <GrAttachment/>
                </EntryOptionButton>
                <div className="flex flex-row items-start bg-white px-2 py-3 rounded-lg flex-1
                    dark:bg-gray-700 dark:text-white text-sm">
                    <div
                        contentEditable='true' 
                        ref={contentRef}
                        onKeyUp={(e)=>handleResize(e.target as HTMLDivElement)}
                        onKeyDown={(e)=>handleResize(e.target as HTMLDivElement)}
                        className='flex-1 overflow-auto h-8 bg-transparent outline-none focus:outline-none'
                        dangerouslySetInnerHTML={{__html:content}}
                        >
                    </div>
                </div>
                <button 
                    type="submit" 
                    className="mx-2 bg-teal-900 text-white p-4 rounded-full ">
                        <TfiReceipt/>
                </button>
                </div>
            </div>
         </form>
    );
});


function EntryOptionButton(props:React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>){
    const {className,...rest} = props;
    return (
        <span className="entry_option_button text-sm cursor-pointer text-white bg-gray-600 hover:bg-gray-700 px-1 py-2 rounded-md mx-1 bg-opacity-30"
            {...rest}
        >
            <style>{`svg path { stroke: white } .entry_option_button *{cursor:pointer}`}</style>
            {props.children}
        </span>
    )
}

export default ChannelEntry;