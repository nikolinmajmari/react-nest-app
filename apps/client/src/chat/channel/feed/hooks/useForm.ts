import React, {KeyboardEventHandler} from "react";
import useAudio, {IUseAudioResult} from "./useAudio";
import useFile, {IUseFileResult} from "./useFile";
import useContent, {IUseContentResult} from "./useContent";


export interface IUseFormResult{
  ref: React.RefObject<HTMLFormElement>,
  file: IUseFileResult,
  content: IUseContentResult,
  audio: IUseAudioResult,
  onKeyDown: KeyboardEventHandler<HTMLFormElement>,
}

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


export default function useForm(){
  /// main form ref
  const formRef = React.useRef<HTMLFormElement>(null);

  /// Form Media Hooks
  const audio = useAudio();
  const file = useFile();
  const content = useContent();

  /// custom effects
  React.useEffect(()=>{
    content.focus();
  },[file.name])

  /// form event keyboard handlers
  const onKeyDown: KeyboardEventHandler<HTMLFormElement> = React.useCallback(async (e) => {
    setTimeout(content.sync);
    if (e.key === "Enter") {
      if (!e.altKey) {
        if(content.refHasContent() || audio.hasAudio || file.hasFile){
          formRef.current?.requestSubmit(null);
        }
      } else if (content.ref.current) {
          content.ref.current.innerHTML += '<div><br/></div>';
          setTimeout(() => setEndOfContenteditable((content.ref.current!)));
      }
    }
    if(e.ctrlKey && e.key === 'v'){
      const data = await navigator.clipboard.read()
      console.log(data.length);
    }
  },[formRef,content.ref]);
  return {
    ref: formRef,
    file,
    content,
    audio,
    onKeyDown
  } as IUseFormResult;
}
