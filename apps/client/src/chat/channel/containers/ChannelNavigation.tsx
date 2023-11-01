import {LinkNavigationButton, NavigationButton} from "../../../components/channels/default";
import {NavigationHeader} from "../../../components/channels/NavigationHeader";
import {TfiArrowLeft, TfiCamera, TfiHeadphone, TfiMenu} from "react-icons/tfi";
import React from "react";
import {ChannelContext} from "../channel-context";
import {useNavigate} from "react-router-dom";
import {SelectedContext} from "../context/SelectedContext";
import {BiSolidTrash} from "react-icons/bi";
import {AiOutlineClose} from "react-icons/ai";
import {useDeleteMessages} from "../../../app/hooks/feed";
import {NotificationContext} from "../../../components/notifications/Toastify";



export function ChannelFeedNavigation() {
  const {channel} = React.useContext(ChannelContext);
  const navigate = useNavigate();
  return (
    <NavigationHeader
      leading={
        <>
          <NavigationButton onClick={() => navigate('/chat/channels')}>
            <TfiArrowLeft/>
          </NavigationButton>
          <label className="px-12">{channel?.alias}</label>
        </>
      }
    >
      <NavigationButton>
        <TfiHeadphone/>
      </NavigationButton>
      <NavigationButton>
        <TfiCamera/>
      </NavigationButton>
      <LinkNavigationButton to={"settings"}>
        <TfiMenu/>
      </LinkNavigationButton>
    </NavigationHeader>
  )
}



export function DeleteMessagesNavigation(){
  const {channel} = React.useContext(ChannelContext);
  const {success,error}= React.useContext(NotificationContext)!;
  const {selected,clear} = React.useContext(SelectedContext);

  const deleteMessages = useDeleteMessages(channel!);

  const handleDelete = async ()=>{
    deleteMessages([...selected]).unwrap()
      .then((e)=>success('Messages deleted successfully'))
      .catch((e)=>error('Messages could not be deleted. '+(e?.message)))

    clear();
  }
  return (
    <NavigationHeader
      leading={
        <>
          <NavigationButton onClick={clear}>
            <AiOutlineClose/>
          </NavigationButton>
          <label className="px-12">{selected.length} Selected</label>
        </>
      }
    >
      <NavigationButton onClick={handleDelete}>
        <BiSolidTrash/>
      </NavigationButton>
    </NavigationHeader>
  );
}
