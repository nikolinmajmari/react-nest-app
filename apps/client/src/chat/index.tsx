import ChannelSettings from "./slices/channel/channel.settings";
import ChannelEmpty from "./slices/channel/channel.empty";
import ChannelMain from "./slices/channel/channel.main"; 
import ChannelsNavigation from "./slices/channels/channels.navigation";
import { Outlet} from "react-router-dom";

export default function Chat(){
    return (
        <div className='flex flex-row w-full h-full bg-cyan-50'>
            <div className="flex w-96 overflow-y-scroll">
                <ChannelsNavigation/>
            </div>
            <div className="flex flex-1 relative">
                <Outlet/>
            </div>
        </div>
    );
}

export {
    ChannelSettings,ChannelEmpty,ChannelMain,ChannelsNavigation
};