import { useGetChannel } from "../../../hooks/channel.hooks";
import { LinkNavigationButton, NavigationButton } from "../../../components/channels/default";
import { NavigationHeader } from "../../../components/channels/NavigationHeader";
import { TfiArrowLeft, TfiBackLeft, TfiCamera, TfiHeadphone, TfiMenu } from "react-icons/tfi";
import { useGetCurrentUser } from "../../../hooks/auth.hooks";
import React from "react";
import { ChannelContext } from "../channel-context";
import { useNavigate } from "react-router-dom";

export default function ChannelNavigation(){
    const {channel} = React.useContext(ChannelContext);
    const navigate = useNavigate();
    return (
        <NavigationHeader
            leading={
              <>
                 <NavigationButton onClick={()=>navigate('/chat')}>
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