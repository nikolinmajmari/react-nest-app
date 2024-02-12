import React, {FormEventHandler, forwardRef, MutableRefObject} from "react";
import {IPostMediaArgs, usePostMessage} from "../slices/hooks/feed";
import {MediaType} from "@mdm/mdm-core";
import {SelectedContext} from "../../../providers/SelectedContextProvider";
import {ChannelContext} from "../providers/ChannelProvider";
import {config} from "./util";
import EntryMedia from "../components/EntryMedia";
import {EntryAudioButton, EntrySubmitButton} from "../components/buttons/EntryButtons";
import useForm from "./hooks/useForm";
import {RecordingStatus} from "./hooks/useAudio";
import EntryOptionButton from "../components/EntryOptionButton";
import {GrAttachment} from "react-icons/gr";
import EntryContent from "../components/EntryContent";
import {AudioRecording} from "./AudioRecording";
import {data} from "autoprefixer";
import useFile from "./hooks/useFile";


export interface IChannelEntryProps{
  disabled?:boolean|undefined
}

const ChannelEntry = forwardRef<HTMLDivElement,IChannelEntryProps>(function (props:IChannelEntryProps, scrollTargetRef) {

  /// context
  const {clear} = React.useContext(SelectedContext);
  const {channel} = React.useContext(ChannelContext)!;

  /// hooks
  const postMessage = usePostMessage(channel!.id);

  const {
    ref,
    audio,
    file,
    content,
    onKeyDown
  } = useForm();


  /// handlers
  const handleAutoScroll = ()=>{
    setTimeout(()=>{
      (scrollTargetRef as MutableRefObject<HTMLDivElement>).current?.scrollTo({
        top:(scrollTargetRef as MutableRefObject<HTMLDivElement>).current.scrollHeight,
        behavior:'smooth'
      })
    });
  }
  const handleFormSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const slug = (Math.random() + 1).toString(36).substring(7);
    if(audio.status!==RecordingStatus.idle){
      audio.controller.finish();
      setTimeout(()=>{
        const blob = new Blob(audio.dataRef.current, { type: audio.recorderRef.current.mimeType });
        const formData = new FormData();
        formData.append('file',blob);
        const mediaPayload = {
          type: config[blob.type],
          uri: URL.createObjectURL(blob),
          formData: formData,
          fileName: 'recording',
        };
        audio.controller.drop();
        const postArgs = {
          content: content.ref.current?.innerText ?? "",
          media: mediaPayload,
          slug,
          onAfterAdd: handleAutoScroll
        };
        content.clear();
        postMessage(postArgs);
      })
      return;
    }



    const upload = file.ref.current?.files?.item(0);
    let mediaPayload: IPostMediaArgs | undefined = undefined;
    if (file.ref.current && file.ref.current.value && upload) {
      mediaPayload = {
        type: config[upload.type] ?? MediaType.file,
        uri: URL.createObjectURL(upload),
        formData: new FormData(ref.current!),
        fileName: upload.name,
      };
      file.clear();
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
          onKeyDown={props.disabled ? undefined:onKeyDown} ref={ref}
          aria-disabled={props.disabled}
          encType="multipart/form-data">
    <input onChange={props.disabled ? undefined:file.onChange}
           type="file"
           id="form-file-input-id"
           name="file"
           ref={file.ref}
           className="hidden"></input>
      <div className=" bg-slate-100 shadow-y-lg bg-opacity-60 sticky bottom-0 backdrop-blur-lg flex flex-col py-3 items-start
                dark:bg-slate-800
            ">
        {file.hasFile && <EntryMedia name={file.name!} type={MediaType.file} clear={file.clear}/>}
        <div className="flex flex-row items-center justify-between w-full px-2">
          {
            audio.empty  && <>
              <EntryOptionButton onClick={props.disabled ? undefined :file.triggerClick}>
                <GrAttachment/>
              </EntryOptionButton>
              <EntryContent ref={content.ref} disabled={props.disabled??false}></EntryContent>
            </>
          }
          {
            audio.loading && (
                <div className={'flex-1 flex justify-end items-center gap-3'}>
                  Loading
                </div>
              )
          }
          {
            audio.hasAudio &&
            <AudioRecording
              data={audio.dataRef.current}
              status={audio.status}
              controller={audio.controller}/>
          }
          {
            (content.hasContent||audio.hasAudio || file.hasFile)
            && <EntrySubmitButton disabled={props.disabled||false}/>
          }
          {
            (!content.hasContent && audio.empty && !file.hasFile)
            && <EntryAudioButton type={"button"} onClick={audio.startRecording}/>
          }
      </div>
    </div>
  </form>);
});


export default ChannelEntry;





