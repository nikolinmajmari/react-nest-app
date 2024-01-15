import React, {FormEventHandler, forwardRef, KeyboardEventHandler, MutableRefObject} from "react";
import {IPostMediaArgs, usePostMessage} from "../slices/hooks/feed";
import {GrAttachment} from "react-icons/gr";
import {MediaType} from "@mdm/mdm-core";
import {AiOutlineSend} from "react-icons/ai";
import {SelectedContext} from "../../../providers/SelectedContextProvider";
import {ChannelContext} from "../providers/ChannelProvider";
import {config} from "./util";
import EntryOptionButton from "../components/EntryOptionButton";
import EntryMedia from "../components/EntryMedia";
import useMedia from "./hooks/useMedia";
import EntryContent from "../components/EntryContent";
import useKeyboard from "./hooks/useKeyboard";
import useContent from "./hooks/useContent";
import {EntrySubmitButton} from "../components/EntryButtons";


export interface IChannelEntryProps{
  disabled?:boolean
}

const ChannelEntry = forwardRef<HTMLDivElement,IChannelEntryProps>(function (props:IChannelEntryProps, ref) {

  /// context
  const {clear} = React.useContext(SelectedContext);
  const {channel} = React.useContext(ChannelContext)!;

  /// refs
  const formRef = React.useRef<HTMLFormElement>(null);

  /// hooks
  const postMessage = usePostMessage(channel!.id);

  const content = useContent();
  const media = useMedia({ onAfterChange: content.focus});
  const {onKeyDown } = useKeyboard({formRef,contentRef:content.ref});

  /// handlers
  const handleAutoScroll = ()=>{
    setTimeout(()=>{
      (ref as MutableRefObject<HTMLDivElement>).current.scrollTo({
        top:(ref as MutableRefObject<HTMLDivElement>).current.scrollHeight,
        behavior:'smooth'
      })
    });
  }
  const handleFormSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const slug = (Math.random() + 1).toString(36).substring(7);
    const file = media.ref.current?.files?.item(0);
    let mediaPayload: IPostMediaArgs | undefined = undefined;
    if (media.ref.current && media.ref.current.value && file) {
      mediaPayload = {
        type: config[file.type] ?? MediaType.file,
        uri: URL.createObjectURL(file),
        formData: new FormData(formRef.current!),
        fileName: file.name,
      };
      media.clear();
    }
    const postArgs = {
      content: content.ref.current?.innerText ?? "",
      media: mediaPayload,
      slug,
      onAfterAdd: handleAutoScroll
    };
    content.clear();
    await postMessage(postArgs);
  }

  return (
    <form onSubmit={props.disabled ? undefined: handleFormSubmit}
          onFocus={props.disabled ? undefined:clear}
          className={'z-10'}
          onKeyDown={props.disabled ? undefined:onKeyDown} ref={formRef}
          aria-disabled={props.disabled}
          encType="multipart/form-data">
    <input onChange={props.disabled ? undefined:media.onChange}
           type="file"
           id="form-file-input-id"
           name="file"
           ref={media.ref}
           className="hidden"></input>
      <div className=" bg-slate-100 shadow-y-lg bg-opacity-60 sticky bottom-0 backdrop-blur-lg flex flex-col py-3 items-start
                dark:bg-slate-800
            ">
        {media.value && <EntryMedia name={media.value} type={MediaType.file} clear={media.clear}/>}
        <div className="flex flex-row items-center justify-between w-full px-2">
        <EntryOptionButton onClick={props.disabled ? undefined :media.trigger}>
          <GrAttachment/>
        </EntryOptionButton>
        <EntryContent ref={content.ref} disabled={props.disabled??false}></EntryContent>
        <EntrySubmitButton disabled={props.disabled||false}/>
      </div>
    </div>
  </form>);
});


export default ChannelEntry;
