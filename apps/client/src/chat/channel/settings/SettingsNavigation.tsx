import {Outlet, useNavigate} from "react-router-dom";
import ChannelDetailsNavigationWrapper from "../components/ChannelDetailsNavigationWrapper";
import {NavigationHeader} from "../../../components/channels/NavigationHeader";
import {NavigationButton} from "../../../components/controls/Buttons";
import {TfiArrowLeft} from "react-icons/tfi";
import {SettingsAvatar, SettingsBody, SettingsChannelName, SettingsListItemLink} from "./Components";
import {ChannelType} from "@mdm/mdm-core";
import SwitchControl from "../../../components/controls/SwitchControl";
import React from "react";
import {ChannelContext} from "../providers/ChannelProvider";

export default function SettingsNavigator() {
  const navigate=useNavigate();
  const {channel} = React.useContext(ChannelContext)!;
  return (
    <>
      <NavigationHeader leading={
        <NavigationButton onClick={() => navigate("/chat/channels/" + channel?.id)}>
          <TfiArrowLeft/>
        </NavigationButton>
      }
                        title={'Settings'}>
      </NavigationHeader>
      <SettingsBody>
        <SettingsAvatar label="A"/>
        <SettingsChannelName label={channel?.alias ?? '-'}/>
        <Outlet/>
      </SettingsBody>
    </>
  );
}

