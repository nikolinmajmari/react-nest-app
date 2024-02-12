import React, {useCallback} from "react";

export interface IUseFileResult{
    ref: React.MutableRefObject<HTMLInputElement>,
    hasFile: boolean,
    name: string|null,
    clear:()=>void,
    triggerClick:()=>void,
    onChange:()=>void,
}


export default function useFile(){
    const [fileName, setFileName] = React.useState<string | null>(null);
    const fileRef = React.useRef<HTMLInputElement>(null);

    const clear = React.useCallback(function (){
        setFileName(null);
        if(fileRef.current){
            fileRef.current.value = "";
        }
    },[setFileName,fileRef]);

    const triggerClick = React.useCallback(
        ()=>fileRef.current?.click(),[fileRef]
    );

    const onChange = useCallback((e:React.ChangeEvent<HTMLInputElement>)=>{
        const path = e.target.value.split('\\').pop();
        if (path) {
            setFileName(path);
        }
    },[setFileName]);

    return {
        ref: fileRef,
        hasFile: fileName!==null,
        name: fileName,
        clear,
        triggerClick,
        onChange,
    } as IUseFileResult
}
