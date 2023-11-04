import {IChannel} from "@mdm/mdm-core";
import {deleteChannelThunk} from "./slices/channels.slice";
import {useNavigate, useParams} from "react-router-dom";
import ChatTile from "../../components/channels/ChannelTile";
import ChannelGroupContainer from "../../components/GroupContainer";
import React from "react";
import ChannelsSkeleton from "../../components/channels/ChannelsSkeleton";
import ChannelsHeader from "./ChannelsHeader";
import ErrorComponent from "../../components/ErrorComponent";
import {ContextMenu} from "../../components/menu/ContextMenu";
import {MenuHeader, MenuItem} from "../../components/menu/Menu";
import {TfiArchive, TfiArrowCircleRight, TfiBell, TfiDownload, TfiTrash} from "react-icons/tfi";
import {useAppDispatch} from "../../app/hooks";
import {useChannels} from "../../app/hooks/channels";
import ChannelsEmpty from "./ChannelsEmpty";
import {useCurrentChannel} from "../../app/hooks/channel";
import {ToastNotificationContext} from "../../providers/ToastNotificationProvider";


export default function ChannelsContainer() {
  const {channels, status, loadChannels, setActiveChannel} = useChannels();
  const {channel} = useParams();
  const navigate = useNavigate();
  React.useEffect(() => {
    if (status === "idle") {
      loadChannels();
    }
  }, [status, loadChannels]);

  const createNavigateHandler = (channel: IChannel) => {
    return () => {
      navigate(`${channel.id}`)
    }
  }
  return (
    <aside className='flex flex-col flex-1 bg-white overflow-y-auto relative dark:bg-gray-800'>
      {
        status!="failed" && <ChannelsHeader/>
      }
      {(status === "idle" || status === "loading") && <ChannelsSkeleton/>}
      {
        status === "mutating"
        && (<div className="opacity-20 bg-gray-600 w-full h-full top-0 absolute flex-1 flex"></div>)
      }
      {
        (status === "succeeded" || status === "mutating") && (
          <ChannelGroupContainer label="Channels" className={'flex-1 flex flex-col'}>
            {
              channels.length===0 && (<ChannelsEmpty/>)
            }
            {channels.map(
              (ch: IChannel) =>
                <ChannelTileContainer
                  key={ch.id}
                  channel={ch}
                  active={ch.id === channel}
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


export function Show(props: { if: boolean, children: React.ReactNode }) {
  return (
    props.if && props.children
  );
}


export interface IChannelTileContainerProps {
  channel: IChannel;
  active: boolean;
  navigate: () => void;
}

export function ChannelTileContainer(props: IChannelTileContainerProps) {
  const notification = React.useContext(ToastNotificationContext);
  const dispatch = useAppDispatch();
  const routerNavigate = useNavigate();
  const handleDeleteChannel = () => {
    dispatch(deleteChannelThunk(channel)).unwrap()
      .then(() => {
        notification?.success('Channel deleted successfully');
        routerNavigate('/chat/channels')
      })
      .catch((e) => notification?.error('An error occured'));
  };
  const {channel, active, navigate} = props;
  const ref = React.useRef(null);
  const label =
    channel.lastMessage?.content ?
      channel.lastMessage.content.slice(0, 40) + (channel.lastMessage.content.length > 40 ? '...' : '')
      :
      '-';
  return (
    <ContextMenu ref={ref} trigger={
      <ChatTile key={channel.id}
                active={active}
                avatar={channel.avatar ?? "U"}
                label={label}
                name={channel.alias ?? "Unkonwn"}
                navigate={navigate}
                ref={ref}/>
    }>
      <MenuHeader>{channel.alias ?? "Unknown"}</MenuHeader>
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
