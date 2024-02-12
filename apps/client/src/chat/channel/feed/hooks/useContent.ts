import React from "react";

export interface IUseContentResult{
    ref: React.RefObject<HTMLDivElement>,
    hasContent: boolean,
    refHasContent: ()=>boolean,
    clear:()=>void,
    focus:()=>void,
    sync: ()=>void,
}


export default function useContent(){
    const [hasContent,setHasContent] = React.useState<boolean>(false);
    const contentRef = React.useRef<HTMLInputElement>(null);
    const contentFocus = ()=>{
        setTimeout(()=>contentRef.current?.focus());
    };
    const contentClear = ()=> setTimeout(()=>{
        if (contentRef.current) {
            contentRef.current.innerHTML = "";
            contentRef.current.focus();
        }
        sync();
    });

    const refHasContent = ()=>{
        return contentRef.current!.innerText.replace(/\s/g,'')!=='';
    }

    const sync = ()=>{
        setHasContent(contentRef.current!.innerText.replace(/\s/g,'')!=='');
    }

    return {
        ref: contentRef,
        hasContent,
        refHasContent,
        focus: contentFocus,
        clear: contentClear,
        sync,
    }
}
