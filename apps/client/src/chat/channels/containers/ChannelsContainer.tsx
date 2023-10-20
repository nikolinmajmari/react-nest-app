import { IChannel, IPartialDeepResolveChannel } from "@mdm/mdm-core";
import { deleteChannelThunk } from "../slices/channels.slice";
import { useNavigate } from "react-router-dom";
import ChatTile from "../../../components/channels/Tile";
import ChannelGroupContainer from "../../../components/GroupContainer";
import React from "react";
import ChannelsSkeleton from "../../../components/channels/ChannelsSkeleton";
import ChannelsHeader from "./ChannelsHeader";
import ErrorComponent from "../../../components/ErrorComponent";
import {ContextMenu } from "../../../components/menu/ContextMenu";
import {  MenuHeader, MenuItem } from "../../../components/menu/Menu";
import { TfiAlert, TfiArchive, TfiArrowCircleRight, TfiArrowLeft, TfiBell, TfiDownload, TfiIdBadge, TfiTrash } from "react-icons/tfi";
import { useAppDispatch } from "../../../app/hooks";
import { NotificationContext } from "../../../components/notifications/Toastify";
import { useChannels} from "../../../app/hooks/channels";



export default function ChannelsContainer(){
    const {channels,activeChannel,status,loadChannels,setActiveChannel} = useChannels()
    const navigate = useNavigate();
    React.useEffect(()=>{
        if(status==="idle"){
            loadChannels();
        }
    },[status,loadChannels]);

    const createNavigateHandler = (channel:IChannel)=>{   
        return ()=>{
            setActiveChannel(channel);
            navigate(`${channel.id}`)
        }
    }
    return (
          <aside className='flex flex-col flex-1 bg-white overflow-y-auto relative dark:bg-gray-800'>
            <ChannelsHeader/>
            { (status === "idle" || status === "loading") &&  <ChannelsSkeleton/>}
            {
                status === "mutating" 
                && (<div className="opacity-20 bg-gray-600 w-full h-full top-0 absolute flex-1 flex"></div>)
            }
            {
            (status==="succeeded" || status==="mutating") && (
                 <ChannelGroupContainer label="Channels">
                    { channels.map(
                        (ch:IChannel)=>
                            <ChannelTileContainer 
                                key={ch.id}
                                channel={ch} 
                                active={ch.id===activeChannel}
                                navigate={createNavigateHandler(ch)}
                            />
                        )
                    }
                </ChannelGroupContainer>
            )
           }
           {
            status === "failed" &&  
            <ErrorComponent 
                resolve={loadChannels} 
                error={'An error occured'}/>
           }
        </aside>
    )
}


export function Show(props:{if:boolean,children:React.ReactNode}){
    return (
        props.if && props.children
    );
}


export interface IChannelTileContainerProps{
    channel: IPartialDeepResolveChannel;
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
    const label = 
        channel.lastMessage?.content ?
        channel.lastMessage.content.slice(0,40) + (channel.lastMessage.content.length > 40 ? '...':'')
        :
        '-';
    return (
        <ContextMenu ref={ref} trigger={
            <ChatTile key={channel.id}
                active={active}
                avatar={channel.avatar??"U"}
                label={label}
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
