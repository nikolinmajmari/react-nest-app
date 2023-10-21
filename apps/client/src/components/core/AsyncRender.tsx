import {AsyncStatus} from "../../app/hooks/core";
import React from "react";

export interface IAsyncRenderProps{
    status:AsyncStatus
    failed:React.ReactNode;
    loading: React.ReactNode;
    success:React.ReactNode;
    children?:React.ReactNode;
}

export default function AsyncRender(props:IAsyncRenderProps){
    switch(props.status){
        case AsyncStatus.failed:
            return props.failed;
        case AsyncStatus.loading:
            return props.loading;
        case AsyncStatus.success:
            return props.success;
    }
    return (props.children);
}
