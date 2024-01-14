import React from "react";

export interface IUseMediaProps{
  onAfterChange?:()=>void,
}

export interface IUseMediaResult{
  value:string|null,
  setValue:React.Dispatch<React.SetStateAction<string|null>>,
  ref:  React.RefObject<HTMLInputElement>,
  trigger:()=>void,
  clear:()=>void,
  onChange:(e:React.ChangeEvent<HTMLInputElement>)=>void,
}



export default function useMedia({onAfterChange}:IUseMediaProps):IUseMediaResult{
  const [value, setValue] = React.useState<string | null>(null);
  const ref = React.useRef<HTMLInputElement>(null);
  const clear = () => {
    setTimeout(()=>{
      setValue(null);
      if (ref.current) {
        ref.current.value = "";
      }
    });
  }
  const trigger = () => {
    ref.current?.click();
  }
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const path = e.target.value.split('\\').pop();
    if (path) {
      setValue(path);
      onAfterChange ? onAfterChange():null;
    }
  }
  return {
    ref,
    value,
    setValue,
    trigger,
    clear,
    onChange
  }
}
