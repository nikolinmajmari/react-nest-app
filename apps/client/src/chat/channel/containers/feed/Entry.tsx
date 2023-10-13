import React, { FormEventHandler, forwardRef } from "react";
import { TfiCrown, TfiFile, TfiReceipt } from "react-icons/tfi";
import { ChannelContext } from "../../channel-context";
import { MessageType } from "@mdm/mdm-core";
import { useCurrentUser } from "../../../../app/hooks/auth";
import { usePostMessageThunk } from "../../../../app/hooks/feed";
import { GrAttachment } from "react-icons/gr";
import { media as mediaClient } from "../../../../api.client/client";
import { useAppDispatch } from "../../../../app/hooks";
import { addMessage, completeMediaProgress,startMediaProgress,updateMediaProgress,failMediaProgress } from "../../slices/channel-feed.slice";


const ChannelEntry = forwardRef(function (props,ref){
    const user = useCurrentUser();
    const dispatch = useAppDispatch();
    const postMessage = usePostMessageThunk();
    const {channel} = React.useContext(ChannelContext);

    const [media,setMedia] = React.useState<string|null>(null);

    const formRef = React.useRef<HTMLFormElement>()
    const contentRef = React.useRef<HTMLDivElement>();
    const mediaRef = React.useRef<HTMLInputElement>();

    const handleMediaClick = ()=>{
        console.log(mediaRef.current);
        mediaRef.current?.click();
    }
    const clearMedia = ()=>{
        setMedia(null);
        mediaRef.current!.value = "";
    }

    const handleFileChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
        const path = e.target.value.split('\\').pop();
        if(path){
            console.log(mediaRef.current?.files[0]);
            setMedia(path);
            contentRef.current?.focus();
            /// set crusor in the end 
        }
    }

    const handleFormSubmit:FormEventHandler<HTMLFormElement> = async (e)=>{
        e.preventDefault();
        const slug = (Math.random() + 1).toString(36).substring(7);
        if(mediaRef.current?.value){
            const formData = new FormData(formRef.current);
            const [file] = mediaRef.current.files!;
            const fileUrl = URL.createObjectURL(file);
            dispatch(
                addMessage(
                    { 
                        media: fileUrl,
                        slug: slug, 
                        content: contentRef.current?.innerText??"", 
                        type: MessageType.text,
                        sender: user,
                    }
                )
            );
            dispatch(startMediaProgress({slug}));
            const res = await mediaClient.upload(formData,(e)=>{
                dispatch(updateMediaProgress({slug,progress:e.progress??0}))
            });
            postMessage(slug,{ content: contentRef.current?.innerText, type: MessageType.text, sender: user,media:res.id})            
            setTimeout(()=>ref?.current?.scrollIntoView({ behavior:"smooth", block: "end", inline: "nearest" }));
        }else{
             postMessage(slug,{ content: contentRef.current?.innerText, type: MessageType.text, sender: user,})
        }
        setTimeout(
            ()=>ref?.current?.scrollIntoView({ behavior:"smooth", block: "end", inline: "nearest" })
        )
    }
    const handleResize = (target:HTMLDivElement)=>{
        target.style.height = "1px";
        target.style.height = `${Math.min(Math.max(target?.scrollHeight,20),160)}px`;
    }
    if(!channel){
        throw new Error('');
    }
    return (
         <form onSubmit={handleFormSubmit} ref={formRef} encType="multipart/form-data">
            <input onChange={handleFileChange} type="file" id="form-file-input-id" name="file" ref={mediaRef} className="hidden"></input>
            <div className=" bg-slate-100 shadow-y-lg bg-opacity-60 sticky bottom-0 backdrop-blur-lg flex flex-col py-3 items-start
                dark:bg-slate-800
            ">
                {
                    media && <div className="media-container flex flex-row flex-wrap">
                        <div className="mx-2 my-2 flex relative flex-row items-center bg-gray-600 px-3 py-1 rounded-md text-white text-xs">
                            <TfiFile className="text-gray-100 font-bold"/>&nbsp;{media}
                            <span onClick={()=>clearMedia()} className="absolute right-0 top-0"><TfiCrown/></span>
                        </div>
                    </div>
                }
             <div className="flex flex-row items-center justify-between w-full px-2">
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
                        className='flex-1 overflow-auto h-5 bg-transparent outline-none focus:outline-none'
                        
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