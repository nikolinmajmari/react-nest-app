import { IChannel } from "@mdm/mdm-core";
import React from "react";

export const ChannelContext = React.createContext<IChannel|null>(null);


export function ChannelProvider(props:{channel:IChannel,children?:any}){
    return (
        <ChannelContext.Provider value={props.channel}>
            {props.children}
        </ChannelContext.Provider>
    )
}