import {useLocation, useNavigate} from "react-router-dom";
import React, {useCallback} from "react";
import {ChannelType, IChannelCreate, IUser, MemberRole} from "@mdm/mdm-core";
import {useCurrentUser} from "../../../app/hooks/auth";
import {users} from "../../../api.client/client";
import {AsyncStatus} from "../../../app/hooks/core";
import {ToastNotificationContext} from "../../../providers/ToastNotificationProvider";

export function useGoBack() {
  const location = useLocation();
  const navigate = useNavigate();
  const goBack =  useCallback(() => navigate(location.state?.previousLocation ?? "/chat/channels"), [navigate, location.state]);
  return {
    goBack,state:location.state
  }
}

export interface ICreateChannelModalProps {
  type: ChannelType
  title: string;
}

export interface ICreateChannelValidation {
  selected?: string | undefined;
  name?: string | undefined;
  avatar?: string | undefined;
}


export function useCustomEffectOnSuccessOrFailure(status: AsyncStatus, error: string) {
  const {goBack} = useGoBack();
  const notification = React.useContext(ToastNotificationContext);
  React.useEffect(() => {
    const timeout = (status === AsyncStatus.success || status === AsyncStatus.failed) ? setTimeout(() => {
      goBack();
      if (status === AsyncStatus.success) {
        notification?.success('Channel created succesfully');
      }
      if (status === AsyncStatus.failed) {
        notification?.error(error.toString());
      }
    }, 0) : null;
    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [goBack, status]);
}


export function useNewChannelForm(type: ChannelType) {
  const [selected, setSelected] = React.useState<IUser[]>([]);
  const [channelName, setChannelName] = React.useState('');

  const toggleSelected = (user: IUser) => {
    setSelected((users) => {
      if (users.findIndex(u => u.id === user.id) === -1) {
        if (type===ChannelType.private) {
          return [user];
        }
        return [...users, user];
      }
      return [...users.filter(u => u.id !== user.id)];
    });
  }
  /// pipes
  const [validation, setValidation] = React.useState<ICreateChannelValidation>({});
  const validate = () => {
    if (selected.length === 0) {
      setValidation({selected: 'You should select at least one user to create a room'});
      return false;
    }
    if (type === ChannelType.group) {
      if (!channelName.trim()) {
        setValidation({name: "Please fill in the name of the channel"});
        return false;
      }
    }
    return {
      alias: channelName ?? '', avatar: 'https://google.com.png/https.png',
      members: selected.map((u) => ({
        user: u.id,
        role: ChannelType.private === type ? MemberRole.admin : MemberRole.member
      }))
    } as IChannelCreate;
  }
  return {
    selected, toggleSelected, channelName, setChannelName, validation, validate,
  }
}

