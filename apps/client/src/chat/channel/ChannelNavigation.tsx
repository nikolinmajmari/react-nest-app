
import {NavigationHeader} from "../../components/channels/NavigationHeader";
import {TfiArrowLeft, TfiCamera, TfiHeadphone, TfiMenu} from "react-icons/tfi";
import React from "react";
import {useNavigate} from "react-router-dom";
import {BiSolidTrash} from "react-icons/bi";
import {AiOutlineClose} from "react-icons/ai";
import {useDeleteMessages} from "./slices/hooks/feed";
import {ChannelContext} from "./providers/ChannelProvider";
import {NavigationButton} from "../../components/controls/Buttons";
import {RouterAwareLinkNavigationButton} from "../../components/controls/Links";
import {ToastNotificationContext} from "../../providers/ToastNotificationProvider";
import {SelectedContext} from "../../providers/SelectedContextProvider";



export function ChannelFeedNavigation() {
  const {channel} = React.useContext(ChannelContext)!;
  const navigate = useNavigate();
  return (
    <NavigationHeader
      leading={
        <>
          <NavigationButton onClick={() => navigate('/chat/channels')}>
            <TfiArrowLeft/>
          </NavigationButton>
          <label className="px-1">{channel?.alias}</label>
        </>
      }
    >
      <NavigationButton>
        <TfiHeadphone/>
      </NavigationButton>
      <NavigationButton>
        <TfiCamera/>
      </NavigationButton>
      <RouterAwareLinkNavigationButton to={"settings"}>
        <TfiMenu/>
      </RouterAwareLinkNavigationButton>
    </NavigationHeader>
  )
}



export function DeleteMessagesNavigation(){
  const {channel} = React.useContext(ChannelContext);
  const {success,error}= React.useContext(ToastNotificationContext)!;
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
