import Channels from "./channels";
import {Outlet, useParams} from "react-router-dom";
import storage from "../core/storage";
import ChannelContainer from "./channel/ChannelContainer";
import {useGetChannelsQuery} from "./channels/channels.api";

export default function Chat() {
  const handleLogout = () => {
    storage.clear();
    window.location.reload();
  }
  const {channel} = useParams();
  const { isError} = useGetChannelsQuery();
  return (
    <>
      <div
        className={`${(channel === undefined) ? 'flex' : 'hidden'} flex flex-1 ${
          status==="failed" ? '':'md:flex-none md:w-96'
        } md:flex bg-white overflow-hidden `}>
        <Channels/>
      </div>
      {
        !isError && (
          <div className={`${channel === undefined ? 'hidden' : 'flex'} relative md:flex flex-1 flex overflow-hidden`}>
            <Outlet/>
          </div>
        )
      }
    </>
  );
}

export {
  ChannelContainer
};
