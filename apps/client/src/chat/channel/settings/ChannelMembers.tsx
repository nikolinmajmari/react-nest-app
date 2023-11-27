import {TfiArrowLeft, TfiPlus, TfiTrash} from "react-icons/tfi";
import {DeepPartialResolve, IChannel, IChannelMember, MemberRole} from "@mdm/mdm-core";
import React from "react";
import {ChannelContext} from "../providers/ChannelProvider";
import {useRemoveChannelMemberMutation, useUpdateChannelMemberMutation} from "../slices/channel-api";
import {FaPlusCircle} from "react-icons/fa";
import {AiOutlineGooglePlus} from "react-icons/ai";
import {BiPlus} from "react-icons/bi";
import NewMemberModal from "./members/NewMember";
import MemberActionsMenu from "./members/MemberActionsMenu";

export default function ChannelMembers() {
  const {channel, isAdmin} = React.useContext(ChannelContext);
  const [showAddModal,setShowAddModal] = React.useState<boolean>(false);
  const [removeMember,removeResult] = useRemoveChannelMemberMutation();
  return (
    <>
      <div className={'flex flex-row justify-between items-center'}>
        <span className="text-lg my-4 px-4">
          Members
        </span>
        <span onClick={()=>setShowAddModal(true)} className={'bg-green-100 hover:bg-green-200 text-green-600 p-2 rounded-full cursor-pointer'}>
          <TfiPlus/>
        </span>
        {
          showAddModal && <NewMemberModal goBack={()=>setShowAddModal(false)}/>
        }
      </div>
      <div className="flex flex-1 flex-col relative">
        {
          (removeResult.isLoading) &&
          <div className="absolute rounded-2xl z-10 bg-slate-800 bg-opacity-20 top-0 w-full h-full"></div>
        }
        <div className={'py-2'}></div>
        {
          channel?.members!.map(function (member) {
            return (
              <MemberItemContainer
                isAdmin={isAdmin ?? false}
                member={member}
                channel={channel}
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
        <div className={'py-1'}></div>
      </div>
    </>
     );
}

function MemberItemContainer({channel,member, isAdmin,deleteMember}: {
  member: IChannelMember,
  channel:IChannel
  isAdmin: boolean,
  deleteMember: () => void
}) {
  const [updateMember,updateResult] = useUpdateChannelMemberMutation();


  const handleMakeAdmin = ()=>{
    updateMember({
      channel: channel!.id,
      member: member.id,
      update:{
        role:MemberRole.admin
      }
    });
  }
  return (
    <div className={'px-4'}>
      {
        (updateResult.isLoading) &&
        <div className="absolute rounded-2xl z-10 bg-slate-800 bg-opacity-20 top-0 w-full h-full"></div>
      }
      <MemberItem
        alias={`${member?.user?.firstName} ${member?.user?.lastName}`}
        avatar={"A"}
        role={member?.role??""}
        key={member.id}
        isAdmin={isAdmin ?? false}
        onActionClick={deleteMember}
      >
        <MemberActionsMenu
          removeMember={deleteMember}
          makeAdmin={member.role===MemberRole.admin?undefined:handleMakeAdmin}
          member={member}
        />
      </MemberItem>
    </div>
  );
}

interface IMemberItemProps {
  avatar: string,
  alias: string,
  role: string,
  isAdmin: boolean,
  onActionClick: () => void;
  children?:React.ReactNode;
}

function MemberItem({alias, avatar, role, isAdmin, onActionClick,children}: IMemberItemProps) {
  return (
    <div className="flex flex-row pb-5 relative px-2 pb-1">
      <div className="avatar w-12 h-12 bg-cyan-900 rounded-full flex items-center justify-center">
        <span className="text-white text-xl">{avatar}</span>
      </div>
      <div className="content flex flex-col items-start ml-4 flex-1">
        <span className="text-md font-bold">{alias}</span>
        <em className="bg-emerald-600 bg-opacity-20 rounded-xl px-2 p-0.5 text-center
          text-xs text-emerald-900 dark:text-white
        ">
          {role}
        </em>
      </div>
      {
        children
      }
    </div>
  )
}
