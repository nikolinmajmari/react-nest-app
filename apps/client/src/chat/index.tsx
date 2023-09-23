import ChannelSettings from "./channel/containers/settings/ChannelSettings";
import Channels from "./channels";
import { Outlet} from "react-router-dom";
import storage from "../core/storage";
import ChannelContainer from "./channel";

export default function Chat(){
    const handleLogout = ()=>{
        storage.clear();
        window.location.reload();
    }
    return (
        <div className="flex flex-col w-full h-full items-stretch">
            <div className="h-16 bg-emerald-900 flex flex-row-reverse items-center px-12">
                <button onClick={handleLogout}>Log Out</button>
            </div>
            <div className='flex flex-row w-full flex-1 overflow-hidden bg-cyan-50'>
                <div className="flex w-96 overflow-y-scroll">
                    <Channels/>
                </div>
                <div className="flex flex-1 relative">
                    <Outlet/>
                </div>
            </div>
        </div>
    );
}

export {
    ChannelSettings,ChannelContainer
};