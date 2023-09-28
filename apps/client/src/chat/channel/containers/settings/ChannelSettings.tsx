import { animated, useSpring } from "@react-spring/web";
import { TfiArrowLeft, TfiCamera, TfiHeadphone, TfiMenu } from "react-icons/tfi";
import { Link, Outlet } from "react-router-dom";
import { NavigationHeader } from "../../../../components/channels/NavigationHeader";
import { LinkNavigationButton } from "../../../../components/channels/default";
import { useGetChannel } from "../../../../hooks/channel.hooks";
import { useGetCurrentUser } from "../../../../hooks/auth.hooks";
import { ChannelType, IChannelMember } from "@mdm/mdm-core";
import { ChannelContext } from "../../channel-context";
import React from "react";
import { SettingsAvatar, SettingsBody, SettingsChannelName, SettingsListItemLink } from "./Components";

export default function ChannelSettings(){
    const {channel} = React.useContext(ChannelContext);
    return (
        <>
         <NavigationHeader leading={
            <LinkNavigationButton to={"/chat/channels/"+channel?.id}>
                <TfiArrowLeft/>
            </LinkNavigationButton>
        }>
        </NavigationHeader>
       <SettingsBody>
          <SettingsAvatar label="A"/>
          <SettingsChannelName label={channel?.alias??'-'}/>
                {
                    channel?.type===ChannelType.group  && (
                        <SettingsListItemLink to="members">
                             Channel Members ({channel?.members.length})
                        </SettingsListItemLink>
                    )
                }
                <div className="p-4 cursor-pointer hover:bg-gray-100 transition-colors border-b-gray-100 border-b-2">
                    Media, Links, and docs
                </div>
                <div className="p-4 cursor-pointer hover:bg-gray-100 transition-colors border-b-gray-100 border-b-2">
                    Disapearing Messages
                </div>
                <div className="p-4 cursor-pointer hover:bg-gray-100 transition-colors border-b-gray-100 border-b-2">
                    Mute Notifications
                </div>
                <div className="p-4 cursor-pointer hover:bg-gray-100 transition-colors border-b-gray-100 border-b-2">
                    Clear Chat
                </div>
                <div className="p-4 cursor-pointer hover:bg-gray-100 transition-colors border-b-gray-100 border-b-2">
                    Export Chat
                </div>
                <div className="p-4 cursor-pointer hover:bg-gray-100 transition-colors border-b-gray-100 border-b-2">
                    Block
                </div>
       </SettingsBody>
        </>
    );
}