import { ChannelType, IChannel, IChannelMember } from "@mdm/mdm-core";
import { useGetCurrentUser } from "../../../hooks/auth.hooks";
import { deleteChannelThunk, setActiveChannel } from "../slices/channels.slice";
import { useNavigate } from "react-router-dom";
import ChatTile, { IChatTileProps } from "../../../components/channels/Tile";
import { useGetActiveChannel, useGetChannelsList, useGetChannelsStateStatus, useLoadChannelsDispatch } from "../../../hooks/channels.hooks";
import ChannelGroupContainer from "../../../components/GroupContainer";
import React from "react";
import ChannelsSkeleton from "../../../components/channels/ChannelsSkeleton";
import ChannelsHeader from "./ChannelsHeader";
import ErrorComponent from "../../../components/ErrorComponent";
import {ContextMenu, MenuContext } from "../../../components/menu/ContextMenu";
import useContextMenu from "../../../components/menu/useContextMenu";
import { createPortal } from "react-dom";
import { Menu, MenuHeader, MenuItem } from "../../../components/menu/Menu";
import { TfiAlert, TfiArchive, TfiArrowCircleRight, TfiArrowLeft, TfiBell, TfiDownload, TfiIdBadge, TfiTrash } from "react-icons/tfi";
import { useAppDispatch } from "../../../app/hooks";
import { channel } from "diagnostics_channel";
import { NotificationContext } from "../../../components/notifications/Toastify";



export default function ChannelsContainer(){
    const channels = useGetChannelsList();
    const activeChannelId = useGetActiveChannel();
    const user = useGetCurrentUser();
    const navigate = useNavigate();
    const status = useGetChannelsStateStatus();
    const loadChannels = useLoadChannelsDispatch();
    const menuContext = React.useContext(MenuContext);
    React.useEffect(()=>{
        if(status==="idle"){
            loadChannels();
        }
    },[status,loadChannels]);

    const createNavigateHandler = (channel:IChannel)=>{   
        return ()=>{
            setActiveChannel(channel.id);
            navigate(`channels/${channel.id}`)
        }
    }
    return (
          <aside className='flex flex-col flex-1 bg-white overflow-y-auto'>
            <ChannelsHeader/>
             {
                (status==="idle" || status==="loading") 
                && <ChannelsSkeleton/>
             }
             {
               status === "mutating" && (
               <div className="opacity-10 flex-1 flex">
                    <ChannelsSkeleton/>
                </div>)
             }
             {
              (status==="succeeded" || status === "mutating" ) && 
                <ChannelGroupContainer label="Channels">
                    {
                    channels.map(
                        (ch:IChannel)=>
                            <ChannelTileContainer 
                                channel={ch} 
                                active={ch.id===activeChannelId}
                                navigate={createNavigateHandler(ch)}
                            />
                        )
                    }
                </ChannelGroupContainer>
             }
             {
                status === "failed" && (
                    <ErrorComponent resolve={loadChannels} error={'An error occured'}/>
                )
             }
        </aside>
    )
}


export interface IChannelTileContainerProps{
    channel: Partial<IChannel>;
    active:boolean;
    navigate:()=>void;
}

export function ChannelTileContainer(props:IChannelTileContainerProps){
    const notification = React.useContext(NotificationContext);
    const dispatch = useAppDispatch();
    const handleDeleteChannel = ()=>{
        dispatch(deleteChannelThunk(channel)).unwrap()
        .then(()=>notification?.success('Channel deleted successfully'))
        .catch((e)=>notification?.error('An error occured'));
    };
    const {channel,active,navigate} = props;
    const ref = React.useRef();
    return (
        <ContextMenu ref={ref} trigger={
            <ChatTile key={channel.id}
                active={active}
                avatar={channel.avatar??"U"}
                label={channel.lastMessage??"Unknown"}
                name={channel.alias??"Unkonwn"}
                navigate={navigate}
            ref={ref}/>
         }>
            <MenuHeader>{channel.alias??"Unknown"}</MenuHeader>
            <MenuItem icon={TfiArrowCircleRight} onClick={() => 1}>
                Open
            </MenuItem>
            <MenuItem icon={TfiArchive} onClick={() => 1}>
                Archive
            </MenuItem>
            <MenuItem icon={TfiBell} onClick={() => 1}>
                Mute
            </MenuItem>
             <MenuItem icon={TfiDownload} onClick={() => 1}>
                Download
            </MenuItem>
             <MenuItem icon={TfiTrash} onClick={() => handleDeleteChannel()}>
               Delete
            </MenuItem>
         </ContextMenu>
    );
}
