import {ActionFunction} from "react-router";
import {ChannelType, MemberRole} from "@mdm/mdm-core";
import {useGoBack} from "./hooks";
import {useDispatchCreateChannel} from "../../../app/hooks/channels";

export function createChannelAction(type:ChannelType):ActionFunction{
  return async function ({request,context}){
    const {goBack} = useGoBack();
    const createChannel = useDispatchCreateChannel(type);
    const formData = await request.formData()
    const members = formData.getAll('members[]') as string[];
    const alias = formData.get('alias') as string|null;
    try{
      createChannel({
        alias: alias,
        type: type,
        avatar: 'https://avatar.url',
        members: members.map(id=>({
          user: id,
          role: type===ChannelType.private ? MemberRole.admin:MemberRole.member
        }))
      })
      return goBack();
    }catch (e){
      return e;
    }
  }
}
