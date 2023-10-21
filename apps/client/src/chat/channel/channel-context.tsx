import {ChannelType, IChannelMember, IPartialDeepResolveChannel, MemberRole} from "@mdm/mdm-core";
import React from "react";
import {useCurrentUser} from "../../app/hooks/auth";

export interface IChannelContext {
  channel?: IPartialDeepResolveChannel;
  isAdmin?: boolean;
}

export const ChannelContext = React.createContext<IChannelContext>({});

export interface IChannelProviderProps {
  channel: IPartialDeepResolveChannel,
  children?: React.ReactNode
}

export function ChannelProvider({channel, children}: IChannelProviderProps) {
  const user = useCurrentUser();
  const getChannel = React.useCallback(() => {
    if (channel?.type === ChannelType.group) {
      return channel;
    }
    const other = (channel?.members as IChannelMember[]).find(m => m.user.id !== user.id);
    return {
      ...channel,
      alias: (other?.user.firstName + ' ' + other?.user.lastName) ?? "",
      avatar: (other?.user.avatar) ?? ""
    };
  }, [channel, user]);
  const isAdmin = (channel?.members as IChannelMember[]).findIndex(m => m.user.id == user.id && m.role == MemberRole.admin) !== -1;
  return (
    <ChannelContext.Provider value={{
      channel: getChannel(),
      isAdmin
    }}>
      {children}
    </ChannelContext.Provider>
  )
}
