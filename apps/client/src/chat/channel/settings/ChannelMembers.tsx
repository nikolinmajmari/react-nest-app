import {TfiArrowLeft, TfiTrash} from "react-icons/tfi";
import {NavigationHeader} from "../../../components/channels/NavigationHeader";
import {DeepPartialResolve, IChannelMember} from "@mdm/mdm-core";
import React from "react";
import {ChannelContext} from "../providers/ChannelProvider";
import {useAppDispatch} from "../../../app/hooks";
import {deleteMemberThunk} from "../slices/channel.slice";
import {useCurrentChannelStatus} from "../../../app/hooks/channel";
import {LinkButton} from "../../../components/controls/Links";
import {useGetChannelMembersQuery, useRemoveChannelMemberMutation} from "../slices/channel-members-api";

export default function ChannelMembers() {
  const status = useCurrentChannelStatus();
  const dispatch = useAppDispatch();
  const {channel, isAdmin} = React.useContext(ChannelContext);
  const {
    isError,
    error,
    isSuccess,
    data,
    isLoading
  } = useGetChannelMembersQuery({channel:channel!.id});
  const [removeMember,result]
    = useRemoveChannelMemberMutation()
  if(isLoading){
    return (
      <div>
        Loading
      </div>
    );
  }
  if(isError){
    return (
      <div>
        {(error as any).data.message}
      </div>
    );
  }

  return (
    <>
      <span className="text-lg my-4">Members</span>
      <div className="flex flex-1 flex-col relative">
        {
          (status === "loading" || result.isLoading) && <div className="absolute z-10 bg-slate-800 bg-opacity-20 top-0 w-full h-full"></div>
        }
        {
          isSuccess && data && data.map(function (member) {
            return (
              <MemberItemContainer
                isAdmin={isAdmin ?? false}
                member={member}
                deleteMember={
                  ()=>removeMember({
                    channel:channel!.id,
                    member:member.id
                  })
                }
              />
            );
          })
        }
      </div>
    </>
     );
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
