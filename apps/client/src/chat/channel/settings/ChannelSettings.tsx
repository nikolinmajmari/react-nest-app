import {ChannelType} from "@mdm/mdm-core";
import React from "react";
import { SettingsListItemLink} from "./Components";
import {ChannelContext} from "../providers/ChannelProvider";
import SwitchControl from "../../../components/controls/SwitchControl";
import {useNavigate} from "react-router-dom";

export default function ChannelSettings() {
  const {channel} = React.useContext(ChannelContext);
  const navigate = useNavigate();
  return (
    <>
      {
        channel?.type === ChannelType.group && (
          <SettingsListItemLink to="members">
            Channel Members ({channel?.members?.length})
          </SettingsListItemLink>
        )
      }
      <SettingsListItemLink to={"/chat/channels/" + channel?.id+'/media'}>
        Media, Links, and docs
      </SettingsListItemLink>
      <div className="p-4 cursor-pointer hover:bg-gray-100 transition-colors border-b-gray-100 border-b-2">
        Disapearing Messages
      </div>
      <div className="p-4 cursor-pointer hover:bg-gray-100 transition-colors border-b-gray-100 border-b-2">
        <SwitchControl label={'Allow Notifications'}
                       update={(checked)=>{
                         return new Promise((resolve)=>{
                           setTimeout(()=>{
                             resolve(Math.random()>0.5);
                           },1000);
                         })
                       }}
        />
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
    </>
  );
}
