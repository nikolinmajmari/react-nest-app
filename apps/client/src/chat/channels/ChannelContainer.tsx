import {IChannel} from "@mdm/mdm-core";
import {useNavigate} from "react-router-dom";
import {useDeleteChannelMutation, useUpdateLastMessage} from "./channels.api";
import React from "react";
import {ToastNotificationContext} from "../../providers/ToastNotificationProvider";
import {ContextMenu} from "../../components/menu/ContextMenu";
import ChatTile from "../../components/channels/ChannelTile";
import {MenuHeader, MenuItem} from "../../components/menu/Menu";
import {TfiArrowCircleRight, TfiTrash} from "react-icons/tfi";
import {useOnChannelMessageReceivedEffect} from "../hooks";

export interface IChannelTileContainerProps {
  channel: IChannel;
  active: boolean;
  navigate: () => void;
}

export default function ChannelTileContainer(props: IChannelTileContainerProps) {
  /// props
  const {channel, active, navigate} = props;

  //// hooks
  const routerNavigate = useNavigate();
  const [deleteChannel,result] = useDeleteChannelMutation();
  const notification = React.useContext(ToastNotificationContext);
  const updateLastMessage = useUpdateLastMessage(channel!);
  /// refs
  const ref = React.useRef(null);

  /// effects
  useOnChannelMessageReceivedEffect(channel,(data)=>{
    updateLastMessage(data);
  },[updateLastMessage]);

  /// handlers
  const handleDeleteChannel = () => {
    deleteChannel(props.channel.id)
      .unwrap()
      .then(() => {
        notification?.success('Channel deleted successfully');
        routerNavigate('/chat/channels')
      })
      .catch((e) => notification?.error('An error occured'));
  };

  return (
    <ContextMenu ref={ref} trigger={
      <ChatTile key={channel.id}
                active={active}
                avatar={channel.avatar??"U"}
                label={channel.lastMessage?.content?.slice(0, 100)??"-"}
                name={channel.alias??'Unknown'}
                navigate={navigate}
                ref={ref}/>
    }>
      <MenuHeader>{channel.alias ?? "Unknown"}</MenuHeader>
      <MenuItem icon={TfiArrowCircleRight} onClick={navigate}>
        Open
      </MenuItem>
      <MenuItem icon={TfiTrash} onClick={() => handleDeleteChannel()}>
        Delete
      </MenuItem>
    </ContextMenu>
  );
}
