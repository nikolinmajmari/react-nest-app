import ChannelSettings from "./slices/channel/containers/Settings";
import ChannelEmpty from "./components/channel/ChannelEmpty";
import ChannelMain from "./slices/channel/containers"; 
import ChannelsNavigation from "./slices/channels/Navigation";
import { Outlet} from "react-router-dom";
import { ModalProvider } from "../components/Modal";

export default function Chat(){
    return (
       <ModalProvider>
         <div className='flex flex-row w-full h-full bg-cyan-50'>
            <div className="flex w-96 overflow-y-scroll">
                <ChannelsNavigation/>
            </div>
            <div className="flex flex-1 relative">
                <Outlet/>
            </div>
        </div>
       </ModalProvider>
    );
}

export {
    ChannelSettings,ChannelEmpty,ChannelMain,ChannelsNavigation
};