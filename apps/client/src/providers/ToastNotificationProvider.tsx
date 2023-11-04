
import React from "react";
import { ToastContainer, toast } from "react-toastify";

export interface IToastNotify{
    success:(a:React.ReactNode)=>void,
    error:(a:React.ReactNode)=>void,
    warn:(a:React.ReactNode)=>void,
    info:(a:React.ReactNode)=>void,
}

export const ToastNotificationContext = React.createContext<IToastNotify|null>(null);

export default function NotificationProvider(props:any){
    const success = (content:React.ReactNode)=>toast.success(content,{position:toast.POSITION.TOP_RIGHT});
    const error = (content:React.ReactNode)=>toast.error(content,{position:toast.POSITION.TOP_RIGHT});
    const warn = (content:React.ReactNode)=>toast.warn(content,{position:toast.POSITION.TOP_RIGHT});
    const info = (content:React.ReactNode)=>toast.info(content,{position:toast.POSITION.TOP_RIGHT});
    return (
        <ToastNotificationContext.Provider value={{success,error,warn,info}}>
            {props.children}
            <ToastContainer autoClose={800}/>
        </ToastNotificationContext.Provider>
    )
}
