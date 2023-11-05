import ChannelDetailsNavigationWrapper from "../components/ChannelDetailsNavigationWrapper";
import {Outlet, useLocation, useNavigate} from "react-router-dom";
import AnimatedOpacity from "../../../components/AnimatedOpacity";
import {
    LinkButton,

    TabLinkNavigation
} from "../../../components/controls/Links";
import {NavigationHeader} from "../../../components/channels/NavigationHeader";
import {TfiArrowLeft} from "react-icons/tfi";
import React from "react";
import {ChannelContext} from "../providers/ChannelProvider";
import {NavigationButton} from "../../../components/controls/Buttons";

export default function MediaNavigator() {
    const location = useLocation();
    const {channel} = React.useContext(ChannelContext)!;
    const navigate = useNavigate();
    return (
        <div
            className='flex z-50 w-full h-full bg-white dark:bg-gray-800 absolute flex-col flex-1 overflow-y-auto items-strech transition-opacity opacity-100'>
            <NavigationHeader leading={
              <NavigationButton onClick={() => navigate("/chat/channels/" + channel?.id+'/settings')}>
                <TfiArrowLeft/>
              </NavigationButton>
            }
              title={'Media'}
            >
            </NavigationHeader>
            <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
                <ul className="flex flex-wrap justify-center -mb-px">
                    <li className="mr-2">
                        <TabLinkNavigation to={''}
                            active={
                                !location.pathname.endsWith('docs') &&
                                !location.pathname.endsWith('links')
                            }
                        >
                            Media
                        </TabLinkNavigation>
                    </li>
                    <li className="mr-2">
                        <TabLinkNavigation to={'docs'}
                            active={
                                location.pathname.endsWith('docs')
                            }
                        >
                            Documents
                        </TabLinkNavigation>
                    </li>
                </ul>
            </div>
            <Outlet/>
        </div>
    );
}
