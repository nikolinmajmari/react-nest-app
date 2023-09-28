import { ChannelType, IChannel, IChannelMember, MemberRole } from "@mdm/mdm-core";
import React from "react";
import { useGetCurrentUser } from "../../hooks/auth.hooks";
import { useGetChannel } from "../../hooks/channel.hooks";

export interface IChannelContext{
    channel?:IChannel|null;
    isAdmin?:boolean;
}

export const ChannelContext = React.createContext<IChannelContext>({});


export function ChannelProvider(props:any){
    const user = useGetCurrentUser();
    const channel = useGetChannel();
    /// updated channel props
    const getChannel = React.useCallback(()=>{
        if(channel?.type===ChannelType.group){
            return channel;
        }   
        const other = (channel?.members as IChannelMember[]).find(m=>m.user.id!==user.id);
        return {
            ...channel,
            alias: (other?.user.firstName + ' ' + other?.user.lastName)??"",
            avatar: (other?.user.avatar)??""
        } as IChannel;
    },[channel,user]);
    const isAdmin = (channel?.members as IChannelMember[]).findIndex(m=>m.user.id == user.id && m.role == MemberRole.admin)!==-1;
    return (
        <ChannelContext.Provider value={{
            channel: getChannel(),
            isAdmin
        }}>
            {props.children}
        </ChannelContext.Provider>
    )
}