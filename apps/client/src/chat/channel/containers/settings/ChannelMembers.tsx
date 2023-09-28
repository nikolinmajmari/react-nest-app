import { TfiArrowLeft, TfiTrash } from "react-icons/tfi";
import { NavigationHeader } from "../../../../components/channels/NavigationHeader";
import { LinkNavigationButton } from "../../../../components/channels/default";
import { IChannelMember } from "@mdm/mdm-core";
import React from "react";
import { ChannelContext } from "../../channel-context";

export default function ChannelMembers(){
    const {channel,isAdmin} = React.useContext(ChannelContext);
    return (
    <div className='lex z-50 w-full h-full bg-white absolute flex-col flex-1 overflow-y-auto transition-opacity opacity-100'>
        <NavigationHeader leading={
            <LinkNavigationButton to={"/chat/channels/"+channel?.id+"/settings"}>
                <TfiArrowLeft/>
            </LinkNavigationButton>
        }>
        </NavigationHeader>
        <div className="flex flex-col flex-1 items-center container bg-white py-2">
            <div className="flex w-2/3 flex-col items-center pb-4">
                 <div className="bg-teal-800 w-40 h-40 rounded-full">
                        <span className="text-lg"></span>
                 </div>
                <span className="text-center text-2xl font-bold py-2">
                    {channel?.alias }
                </span>
            </div>
            <span className="text-mb">Members</span>
            <div className="flex flex-1 flex-col w-2/3 justify-start pt-6">
              {
                channel?.members.map((member:IChannelMember)=>(<MemberItemContainer isAdmin={isAdmin??false} member={member}/>))
              }
            </div>
        </div>
    </div>);
}

function MemberItemContainer({member,isAdmin}:{member:IChannelMember,isAdmin:boolean}){
    return (
         <MemberItem 
            alias={`${member.user.firstName} ${member.user.lastName}`} 
            avatar={"A"} 
            role={member.role} 
            isAdmin={isAdmin??false} 
            onActionClick={function (): void {
                throw new Error("Function not implemented.");
            }}
            />
    );
}

interface IMemberItemProps{
    avatar:string,
    alias:string,
    role:string,
    isAdmin:boolean,
    onActionClick:()=>void
}

function MemberItem({alias,avatar,role,isAdmin,onActionClick}:IMemberItemProps){
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
