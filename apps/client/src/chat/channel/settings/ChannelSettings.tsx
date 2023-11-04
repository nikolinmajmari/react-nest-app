import {TfiArrowLeft} from "react-icons/tfi";
import {NavigationHeader} from "../../../components/channels/NavigationHeader";
import {ChannelType} from "@mdm/mdm-core";
import React from "react";
import {SettingsAvatar, SettingsBody, SettingsChannelName, SettingsListItemLink} from "./Components";
import {ChannelContext} from "../providers/ChannelProvider";
import {LinkButton} from "../../../components/controls/Links";

export default function ChannelSettings() {
  const {channel} = React.useContext(ChannelContext);
  return (
    <>
      <NavigationHeader leading={
        <LinkButton to={"/chat/channels/" + channel?.id}>
          <TfiArrowLeft/>
        </LinkButton>
      }>
      </NavigationHeader>
      <SettingsBody>
        <SettingsAvatar label="A"/>
        <SettingsChannelName label={channel?.alias ?? '-'}/>
        {
          channel?.type === ChannelType.group && (
            <SettingsListItemLink to="members">
              Channel Members ({channel?.members?.length})
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
