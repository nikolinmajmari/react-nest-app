import React, {FormEventHandler, ForwardedRef, forwardRef, KeyboardEventHandler, MutableRefObject} from "react";
import {TfiCrown, TfiFile, TfiReceipt} from "react-icons/tfi";
import {ChannelContext} from "../../channel-context";
import {usePostMediaMessage, usePostMessageThunk} from "../../../../app/hooks/feed";
import {GrAttachment} from "react-icons/gr";
import {MediaType} from "@mdm/mdm-core";

export function useKeyPress(){
  const [alt,setAlt] = React.useState<boolean>(false);
  const handleKeyUp:KeyboardEventHandler = function (e){
    switch (e.key){
      case "Alt":
        setAlt(false);
        break;
    }
  }
  const handleKeyDown:KeyboardEventHandler = function (e){
    switch (e.key){
      case "Alt":
        setAlt(true);
        break;
    }
  }
  return {
    alt,onKeyUp:handleKeyUp,onKeyDown:handleKeyDown
  }
}

function setEndOfContenteditable(contentEditableElement:HTMLElement)
{
  var range,selection;
  if(document.createRange)//Firefox, Chrome, Opera, Safari, IE 9+
  {
    range = document.createRange();//Create a range (a range is a like the selection but invisible)
    range.selectNodeContents(contentEditableElement);//Select the entire contents of the element with the range
    range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
    selection = window.getSelection();//get the selection object (allows you to change selection)
    selection?.removeAllRanges();//remove any selections already made
    selection?.addRange(range);//make the range you have just created the visible selection
  }
}

const config :{[key:string]:MediaType}=  {
  "audio/mpeg":MediaType.audio,
  "audio/vorbis":MediaType.audio,

  /// images
  "image/jpeg":MediaType.image,
  "image/png":MediaType.image,
  "image/svg+xml":MediaType.image,

  /// video
  "video/mp4":MediaType.video,

  /// files
  "application/octet-stream":MediaType.file,
  "application/pdf":MediaType.pdf,

}

const ChannelEntry = forwardRef<HTMLDivElement>(function (props, ref) {
  /// state
  const {channel} = React.useContext(ChannelContext);
  const [media, setMedia] = React.useState<string | null>(null);
  const {alt,onKeyUp,onKeyDown} = useKeyPress();
  /// refs
  const formRef = React.useRef<HTMLFormElement>(null)
  const contentRef = React.useRef<HTMLDivElement>(null);
  const mediaRef = React.useRef<HTMLInputElement>(null);
  const forwardedRef = ref as MutableRefObject<HTMLDivElement>;

  /// post thunks
  const postMessage = usePostMessageThunk();
  const postMediaMessage = usePostMediaMessage();


  /// ui
  const handleScrollToBottom = function () {
    setTimeout(() => forwardedRef.current?.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"}))
  };
  const handleResize = (target: HTMLDivElement) => {
    target.style.height = "1px";
    target.style.height = `${Math.min(Math.max(target?.scrollHeight, 20), 160)}px`;
  }


  /// interactions
  const handleMediaClick = () => {
    mediaRef.current?.click();
  }
  const clearMedia = () => {
    setMedia(null);
    if (mediaRef.current) {
      mediaRef.current.value = "";
    }
  }
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const path = e.target.value.split('\\').pop();
    if (path) {
      setMedia(path);
      contentRef.current?.focus();
    }
  }

  /// data submit
  const handleFormSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const slug = (Math.random() + 1).toString(36).substring(7);
    const file = mediaRef.current?.files?.item(0);
    if (mediaRef.current && mediaRef.current.value && file) {
      const formData = new FormData(formRef.current!);
      const fileUri = URL.createObjectURL(file);
      clearMedia();
      await postMediaMessage({
        content: contentRef.current?.innerText ?? '', media: {
          type: config[file.type]??MediaType.file, uri: fileUri
        }, formData, slug, onAfterAdd: handleScrollToBottom
      });
    } else {
      postMessage(slug, {content: contentRef.current?.innerText??""})
      handleScrollToBottom();
    }
    if (contentRef.current) {
      contentRef.current.innerHTML = "";
      contentRef.current.focus();
    }
  }
  const handleFormOnKeyDown: KeyboardEventHandler<HTMLFormElement> = (e)=>{
    onKeyDown(e);
    if(e.key==="Enter"){
      if(!alt){
        handleFormSubmit(e);
      }else if(contentRef.current){
        contentRef.current.innerHTML += '<div><br/></div>';
        setTimeout(()=>setEndOfContenteditable(contentRef.current!));
      }
    }
  }

  if (!channel) {
    throw new Error('');
  }
  return (<form onSubmit={handleFormSubmit} onKeyDown={handleFormOnKeyDown} onKeyUp={onKeyUp} ref={formRef} encType="multipart/form-data">
    <input onChange={handleFileChange}
           type="file"
           id="form-file-input-id"
           name="file"
           ref={mediaRef}
           className="hidden"></input>
    <div className=" bg-slate-100 shadow-y-lg bg-opacity-60 sticky bottom-0 backdrop-blur-lg flex flex-col py-3 items-start
                dark:bg-slate-800
            ">
      {media && <div className="media-container flex flex-row flex-wrap">
        <div
          className="mx-2 my-2 flex relative flex-row items-center bg-gray-600 px-3 py-1 rounded-md text-white text-xs">
          <TfiFile className="text-gray-100 font-bold"/>&nbsp;{media}
          <span onClick={() => clearMedia()} className="absolute right-0 top-0"><TfiCrown/></span>
        </div>
      </div>}
      <div className="flex flex-row items-center justify-between w-full px-2">
        <EntryOptionButton onClick={handleMediaClick}>
          <GrAttachment/>
        </EntryOptionButton>
        <div className="flex flex-row items-start bg-white px-2 py-3 rounded-lg flex-1
                        dark:bg-gray-700 dark:text-white text-sm">
          <div
            contentEditable='true'
            ref={contentRef}
            onKeyUp={(e) => handleResize(e.target as HTMLDivElement)}
            onKeyDown={(e) => handleResize(e.target as HTMLDivElement)}
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
  </form>);
});


function EntryOptionButton(props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>) {
  const {className, ...rest} = props;
  return (<span
    className="entry_option_button text-sm cursor-pointer text-white bg-gray-600 hover:bg-gray-700 px-1 py-2 rounded-md mx-1 bg-opacity-30"
    {...rest}
  >
            <style>{`svg path { stroke: white } .entry_option_button *{cursor:pointer}`}</style>
    {props.children}
        </span>)
}

export default ChannelEntry;
