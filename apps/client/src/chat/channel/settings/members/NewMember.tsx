import AppModal from "../../../../components/modals/Modal";
import {useGoBack} from "../../../../components/modals/hooks";
import {Dialog} from "@headlessui/react";
import {FiUsers} from "react-icons/fi";
import {FaSpinner, FaUsers} from "react-icons/fa";
import {FaUsersLine} from "react-icons/fa6";
import {HiUsers} from "react-icons/hi";
import {PiUsersFill} from "react-icons/pi";
import {ImUsers} from "react-icons/im";
import {ChannelType, IUser, MemberRole} from "@mdm/mdm-core";
import React from "react";
import {UserSearchPicker} from "../../../../components/users/UserSearchPicker";
import {SubmitButton} from "../../../../components/controls/Buttons";
import {useAddChannelMemberMutation, useRemoveChannelMemberMutation} from "../../slices/channel-api";
import {ToastNotificationContext} from "../../../../providers/ToastNotificationProvider";
import {CgSpinner} from "react-icons/cg";
import {ChannelContext} from "../../providers/ChannelProvider";

export default function NewMemberModal({goBack}:{goBack:()=>void}){
  const notificationContext = React.useContext(ToastNotificationContext);
  const {channel} = React.useContext(ChannelContext)!;
  const [selected,setSelected] = React.useState<IUser[]>([]);
  const [addMember,result] = useAddChannelMemberMutation();
  React.useEffect(()=>{
    if(result.isSuccess){
      notificationContext?.success("Member added successfully");
      return goBack();
    }
  },[result.isSuccess]);
  const toggleSelected = (user: IUser) => {
    setSelected((users) => {
      if (users.findIndex(u => u.id === user.id) === -1) {
        return [user];
        return [...users, user];
      }
      return [...users.filter(u => u.id !== user.id)];
    });
  }

  const handleAddChannelMembers = (e:any)=>{
    e.preventDefault();
    e.stopPropagation();
    if(selected.length>0){
      addMember({
        channel:channel!.id,
        member:{
          user: selected[0].id as unknown as IUser,
          role: MemberRole.member
        }
      })
    }
  }

  return(
    <AppModal close={goBack}>
      <Dialog.Title className={'text-emerald-950 gap-2 pb-4 font-bold flex flex-row items-center' +
        ' dark:text-gray-200'
        }>
        <label className={'text-xl '}>Add new Team Membes</label>
        <span className={'text-emerald-900 border-2 rounded-full border-emerald-950 border-opacity-40 p-1 ' +
          ' dark:text-gray-400 dark:border-white'}>
          <ImUsers size={16}/>
        </span>
      </Dialog.Title>
      <Dialog.Overlay/>
      <Dialog.Description>
        <form className={'flex flex-col items-stretch'}
              onSubmit={handleAddChannelMembers}>
          {
            result.error && (
              <div className={'bg-red-50 text-red-800 px-2 py-2 my-2 rounded-lg'}>
                {(result.error as any).data.message}
                {JSON.stringify(result.error)}
              </div>
            )
          }
          <UserSearchPicker
            selected={selected}
            toggleSelected={toggleSelected}
            multiple={false}
            error={''}
          />
          <SubmitButton
            disabled={selected.length==0}
            className={' flex flex-row gap-4 self-strech items-center justify-center'}>
            {
              result.isLoading && (
                <FaSpinner size={16}/>
              )
            }
            Add Members
          </SubmitButton>
        </form>
      </Dialog.Description>
    </AppModal>
  )
}
