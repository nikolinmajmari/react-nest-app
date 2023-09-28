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

    const getChannelTileProps =function (channel:IChannel):IChatTileProps{
        let name = channel.alias;
        let avatar = channel.avatar;
        if(channel.type===ChannelType.private){
            const otherMember = (channel.members as IChannelMember[]).find(m=>m.user?.id !== user.id);
            /// for private channels, other member name will be used as alias 
            name = `${otherMember?.user.firstName} ${otherMember?.user.lastName}`;
            avatar = name.split(' ').map(e=>e.charAt(0)).join('');
        }
        return {
            ...channel,
            label: channel.lastMessage??' ',
            name: name??'Unknown',
            avatar: avatar??'UU',
            active: channel.id === activeChannelId,
            navigate: ()=>{
                
                setActiveChannel(channel.id);
                navigate(`channels/${channel.id}`)
            }
        }
    }

    const renderChannels = ()=>{
        return channels.map((ch:IChannel)=>(<ChannelTileContainer channel={ch} key={ch.id} {...getChannelTileProps(ch)}/>));
    }
    return (
          <aside className='flex flex-col flex-1 bg-white'>
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
                    { renderChannels()}
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


export function ChannelTileContainer(props:IChatTileProps&{channel:Partial<IChannel>}){
    const notification = React.useContext(NotificationContext);
    const dispatch = useAppDispatch();
    const handleDeleteChannel = ()=>{
        dispatch(deleteChannelThunk(props.channel)).unwrap()
        .then(()=>notification?.success('Channel deleted successfully'))
        .catch((e)=>notification?.error('An error occured'));
    };
    const ref = React.useRef();
    return (
        <ContextMenu ref={ref} trigger={
            <ChatTile key={props.name} {...props} ref={ref}/>
         }>
            <MenuHeader>{props.name}</MenuHeader>
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
