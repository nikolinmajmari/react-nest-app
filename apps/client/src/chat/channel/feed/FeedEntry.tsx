import React, {FormEventHandler, forwardRef, KeyboardEventHandler, MutableRefObject} from "react";
import {IPostMediaArgs, usePostMessage} from "../../../app/hooks/feed";
import {GrAttachment} from "react-icons/gr";
import {MediaType} from "@mdm/mdm-core";
import {useKeyPress} from "./hooks";
import {ActionButton, FileTile} from "../components/messages/FileComponents";
import {AiOutlineClose, AiOutlineSend} from "react-icons/ai";
import {SelectedContext} from "../../../providers/SelectedContextProvider";
import {ChannelContext} from "../providers/ChannelProvider";


function setEndOfContenteditable(contentEditableElement: HTMLElement) {
  var range, selection;
  if (document.createRange)//Firefox, Chrome, Opera, Safari, IE 9+
  {
    range = document.createRange();//Create a range (a range is a like the selection but invisible)
    range.selectNodeContents(contentEditableElement);//Select the entire contents of the element with the range
    range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
    selection = window.getSelection();//get the selection object (allows you to change selection)
    selection?.removeAllRanges();//remove any selections already made
    selection?.addRange(range);//make the range you have just created the visible selection
  }
}

const config: { [key: string]: MediaType } = {
  "audio/mpeg": MediaType.audio, "audio/vorbis": MediaType.audio,

  /// images
  "image/jpeg": MediaType.image, "image/png": MediaType.image, "image/svg+xml": MediaType.image,

  /// video
  "video/mp4": MediaType.video,

  /// files
  "application/octet-stream": MediaType.file, "application/pdf": MediaType.pdf,

}

export interface IChannelEntryProps{
  disabled?:boolean
}

const ChannelEntry = forwardRef<HTMLDivElement,IChannelEntryProps>(function (props:IChannelEntryProps, ref) {
  /// context
  const {clear} = React.useContext(SelectedContext);
  /// state
  const [media, setMedia] = React.useState<string | null>(null);
  const clearMedia = () => {
    setMedia(null);
    if (mediaRef.current) {
      mediaRef.current.value = "";
    }
  }
  /// key press
  const { alt, onKeyUp, onKeyDown} = useKeyPress();
  /// refs
  const formRef = React.useRef<HTMLFormElement>(null)
  const contentRef = React.useRef<HTMLDivElement>(null);
  const mediaRef = React.useRef<HTMLInputElement>(null);
  const forwardedRef = ref as MutableRefObject<HTMLDivElement>;
  /// post thunks
  const {channel} = React.useContext(ChannelContext)!;
  const postMessage = usePostMessage(channel!.id);
  /// feed selection context
  const handleResize = (target: HTMLDivElement) => {
    target.style.height = "1px";
    target.style.height = `${Math.min(Math.max(target?.scrollHeight, 20), 160)}px`;
  }
  /// interactions
  const handleMediaClick = () => {
    mediaRef.current?.click();
  }

  const handleAutoScroll = ()=>{
    setTimeout(()=>{
      forwardedRef.current.scrollTo({
        top:forwardedRef.current.scrollHeight,
        behavior:'smooth'
      })
    });
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
    let mediaPayload: IPostMediaArgs | undefined = undefined;
    if (mediaRef.current && mediaRef.current.value && file) {
      const formData = new FormData(formRef.current!);
      const fileUri = URL.createObjectURL(file);
      clearMedia();
      mediaPayload = {
        type: config[file.type] ?? MediaType.file,
        uri: fileUri,
        formData,
        fileName: file.name,
      };
    }
    const postArgs = {
      content: contentRef.current?.innerText ?? "",
      media: mediaPayload,
      slug,
      onAfterAdd:handleAutoScroll
    };
    if (contentRef.current) {
      contentRef.current.innerHTML = "";
      contentRef.current.focus();
    }
    await postMessage(postArgs);
  }
  const handleFormOnKeyDown: KeyboardEventHandler<HTMLFormElement> =async (e) => {
    onKeyDown(e);
    if (e.key === "Enter") {
      if (!e.altKey) {
        handleFormSubmit(e);
      } else if (contentRef.current) {
        contentRef.current.innerHTML += '<div><br/></div>';
        setTimeout(() => setEndOfContenteditable(contentRef.current!));
      }
    }
    if(e.ctrlKey && e.key === 'v'){
      const data = await navigator.clipboard.read()
      console.log(data.length);
    }
  }

  return (
    <form onSubmit={props.disabled ? undefined: handleFormSubmit}
                onFocus={props.disabled ? undefined:clear}
                className={'z-10'}
                onKeyDown={props.disabled ? undefined:handleFormOnKeyDown} onKeyUp={onKeyUp} ref={formRef}
                aria-disabled={props.disabled}
                encType="multipart/form-data">
    <input onChange={props.disabled ? undefined:handleFileChange}
           type="file"
           id="form-file-input-id"
           name="file"
           ref={mediaRef}
           className="hidden"></input>
    <div className=" bg-slate-100 shadow-y-lg bg-opacity-60 sticky bottom-0 backdrop-blur-lg flex flex-col py-3 items-start
                dark:bg-slate-800
            ">
      {media &&
        <div className="media-container flex flex-row flex-wrap px-4 pb-2">
          <FileTile
            type={MediaType.file}
            fileName={media}
            action={
              <ActionButton onClick={() => clearMedia()}>
                <AiOutlineClose size={18}/>
              </ActionButton>
            }
          />
      </div>}
      <div className="flex flex-row items-center justify-between w-full px-2">
        <EntryOptionButton onClick={props.disabled ? undefined :handleMediaClick}>
          <GrAttachment/>
        </EntryOptionButton>
        <div className="flex flex-row items-start bg-white px-2 py-3 rounded-lg flex-1
                        dark:bg-gray-700 dark:text-white text-sm">
          <div
            contentEditable={
              props.disabled ? undefined:'true'
            }
            ref={contentRef}
            onKeyUp={props.disabled ? undefined:(e) => handleResize(e.target as HTMLDivElement)}
            onKeyDown={props.disabled ? undefined:(e) => handleResize(e.target as HTMLDivElement)}
            className='flex-1 overflow-auto h-5 bg-transparent outline-none focus:outline-none'
          >
          </div>
        </div>
        <button
          type="submit"
          disabled={props.disabled}
          className="mx-2 bg-teal-800 hover:bg-teal-900 text-white p-4 rounded-full ">
          <AiOutlineSend/>
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
