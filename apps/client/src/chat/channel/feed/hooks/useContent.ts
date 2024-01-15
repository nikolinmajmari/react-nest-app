import React from "react";

export interface IContentProps{
  ref: React.RefObject<HTMLInputElement>,
  focus: ()=>void,
  clear: ()=>void,
}

export default function useContent():IContentProps{
  const ref = React.useRef<HTMLInputElement>(null);
  const focus = ()=>{
    setTimeout(()=>ref.current?.focus());
  };
  const clear = ()=>{
    setTimeout(()=>{
      if (ref.current) {
        ref.current.innerHTML = "";
        ref.current.focus();
      }
    })
  }
  return {
    ref,clear,focus,
  }
}
