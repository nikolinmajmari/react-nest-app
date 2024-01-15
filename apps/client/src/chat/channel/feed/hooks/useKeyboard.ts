import React, {KeyboardEventHandler} from "react";


export interface IUseFormResult{
  onKeyDown: KeyboardEventHandler<HTMLFormElement>
}

export interface IUseKeyboardProps{
  formRef: React.RefObject<HTMLFormElement>,
  contentRef: React.RefObject<HTMLInputElement>,
}

export default function useKeyboard(props:IUseKeyboardProps):IUseFormResult{
  const { formRef,contentRef} = props;
  const onKeyDown: KeyboardEventHandler<HTMLFormElement> = React.useCallback(async (e) => {
    if (e.key === "Enter") {
      if (!e.altKey) {
        formRef.current?.requestSubmit(null);
      } else if (contentRef.current) {
        contentRef.current.innerHTML += '<div><br/></div>';
        setTimeout(() => setEndOfContenteditable(contentRef.current!));
      }
    }
    if(e.ctrlKey && e.key === 'v'){
      const data = await navigator.clipboard.read()
      console.log(data.length);
    }
  },[formRef,contentRef]);

  return {
    onKeyDown
  };
}


export function setEndOfContenteditable(contentEditableElement: HTMLElement) {
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
