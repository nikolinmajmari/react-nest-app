import Channels from "./channels";
import {Outlet, useParams} from "react-router-dom";
import storage from "../core/storage";
import ChannelContainer from "./channel/containers/ChannelContainer";

export default function Chat() {
  const handleLogout = () => {
    storage.clear();
    window.location.reload();
  }
  const {id} = useParams();
  return (
    <>
      <div
        className={`${id === undefined ? 'flex' : 'hidden'} flex flex-1 md:flex-none md:flex md:w-96 bg-white overflow-hidden `}>
        <Channels/>
      </div>
      <div className={`${id === undefined ? 'hidden' : 'flex'} relative md:flex flex-1 flex overflow-hidden`}>
        <Outlet/>
      </div>
    </>
  );
}

export {
  ChannelContainer
};
