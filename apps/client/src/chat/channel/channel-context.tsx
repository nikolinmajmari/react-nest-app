import {ChannelType, IChannel, IChannelMember, MemberRole} from "@mdm/mdm-core";
import React from "react";
import {useCurrentUser} from "../../app/hooks/auth";

export interface IChannelContext {
  channel?: IChannel;
  isAdmin?: boolean;
}

export const ChannelContext = React.createContext<IChannelContext>({});

export interface IChannelProviderProps {
  channel: IChannel,
  children?: React.ReactNode
}

export function ChannelProvider({channel, children}: IChannelProviderProps) {
  const user = useCurrentUser();
  const isAdmin = (channel?.members as IChannelMember[]).findIndex(m => m.user.id == user.id && m.role == MemberRole.admin) !== -1;
  return (
    <ChannelContext.Provider value={{
      channel: channel,
      isAdmin
    }}>
      {children}
    </ChannelContext.Provider>
  )
}
