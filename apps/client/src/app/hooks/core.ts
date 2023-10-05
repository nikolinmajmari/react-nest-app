import React, { useCallback } from "react";

export interface IAsyncHook<T>{
    status: "idle"|"loading"|"success"|"failed";
    success?:T;
    error?:any;
}

export function useAsyncHook<T>(handler:()=>Promise<T>):[IAsyncHook<T> ,() => Promise<void>]{
    const  [async,setAsync] = React.useState<IAsyncHook<T>>({
        status: 'idle'
    });
    const startAsync = async function(){
        try{
            setAsync({
                'status':"loading"
            })
            const success = await handler();
            setAsync({
                status: "success",
                success
            })
        }catch(e){
            setAsync({
                status: "failed",
                error: e
            })
        }
    }
    return [async,useCallback(startAsync,[handler])];
}
