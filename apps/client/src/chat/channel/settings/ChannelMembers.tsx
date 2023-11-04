import {TfiArrowLeft, TfiTrash} from "react-icons/tfi";
import {NavigationHeader} from "../../../components/channels/NavigationHeader";
import {DeepPartialResolve, IChannelMember} from "@mdm/mdm-core";
import React from "react";
import {ChannelContext} from "../providers/ChannelProvider";
import {useAppDispatch} from "../../../app/hooks";
import {deleteMemberThunk} from "../slices/channel.slice";
import {useCurrentChannelStatus} from "../../../app/hooks/channel";
import {LinkButton} from "../../../components/controls/Links";

export default function ChannelMembers() {
  const status = useCurrentChannelStatus();
  const dispatch = useAppDispatch();
  const {channel, isAdmin} = React.useContext(ChannelContext);
  return (
    <div
      className='lex z-50 w-full h-full bg-white absolute flex-col flex-1 overflow-y-auto transition-opacity opacity-100'>
      <NavigationHeader leading={
        <LinkButton to={"/chat/channels/" + channel?.id + "/settings"}>
          <TfiArrowLeft/>
        </LinkButton>
      }>
      </NavigationHeader>
      <div className="flex flex-col flex-1 items-center container bg-white py-2">
        <div className="flex w-2/3 flex-col items-center pb-4">
          <div className="bg-teal-800 w-40 h-40 rounded-full">
            <span className="text-lg"></span>
          </div>
          <span className="text-center text-2xl font-bold py-2">
                    {channel?.alias}
                </span>
        </div>
        <span className="text-mb">Members</span>
        <div className="flex flex-1 flex-col w-2/3 justify-start pt-6 relative">
          {
            status === "loading" && <div className="absolute z-10 bg-slate-800 bg-opacity-20 top-0 w-full h-full"></div>
          }
          {
            channel?.members?.map((member) => (
              <MemberItemContainer
                isAdmin={isAdmin ?? false}
                member={member}
                deleteMember={() => dispatch(deleteMemberThunk(member))}
              />)
            )
          }
        </div>
      </div>
    </div>);
}

function MemberItemContainer({member, isAdmin, deleteMember}: {
  member: DeepPartialResolve<IChannelMember>,
  isAdmin: boolean,
  deleteMember: () => void
}) {
  return (
    <MemberItem
      alias={`${member?.user?.firstName} ${member?.user?.lastName}`}
      avatar={"A"}
      role={member?.role??""}
      isAdmin={isAdmin ?? false}
      onActionClick={deleteMember}
    />
  );
}

interface IMemberItemProps {
  avatar: string,
  alias: string,
  role: string,
  isAdmin: boolean,
  onActionClick: () => void
}

function MemberItem({alias, avatar, role, isAdmin, onActionClick}: IMemberItemProps) {
  return (
    <div className="flex flex-row pb-5">
      <div className="avatar w-12 h-12 bg-cyan-900 rounded-full flex items-center justify-center">
        <span className="text-white text-xl">{avatar}</span>
      </div>
      <div className="content flex flex-col ml-4 flex-1">
        <span className="text-md font-bold">{alias}</span>
        <em className="text-sm">{role}</em>
      </div>
      {
        isAdmin && (
          <div className="action">
            <button onClick={onActionClick} className="bg-red-800 hover:bg-red-900 p-2 rounded-full">
              <TfiTrash className="text-white " size={'16'}/>
            </button>
          </div>
        )
      }
    </div>
  )
}
