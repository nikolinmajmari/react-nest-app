import {Menu, Transition} from "@headlessui/react";
import {BiDotsVertical, BiPhoneCall, BiPhoneOff, BiSolidChevronDown, BiSolidEdit, BiSolidEditAlt} from "react-icons/bi";
import React, {Fragment} from "react";
import {AiFillDelete} from "react-icons/ai";
import {IChannelMember} from "@mdm/mdm-core";

export interface IMemberActionsMenuProp{
  member:IChannelMember,
  removeMember?:()=>void,
  exitGroup?:()=>void,
  makeAdmin?:()=>void,
  disableSentMessage?:()=>void,
  enableSentMessage?:()=>void,
  disableCalls?:()=>void,
  enableCalls?:()=>void,
}



export default function MemberActionsMenu(props:IMemberActionsMenuProp){
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="">
          <BiDotsVertical
            className="ml-2 -mr-1 h-5 w-5 text-violet-200 hover:text-violet-100"
            aria-hidden="true"
          />
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute z-10 shadow-2xl rounded-md right-0 top-4 w-56 origin-top-right divide-y
        focus:outline-none bg-white bg-opacity-70 backdrop-blur-sm
        dark:backdrop-blur-sm dark:bg-slate-800 dark:bg-opacity-80 ">
          <div className={'px-4 py-2 text-emerald-700 font-bold dark:text-white'}>
            {props.member.user.firstName} {props.member.user.lastName}
          </div>
          {
            props.makeAdmin && (
              <MenuItem onClick={props.makeAdmin}>
                <BiSolidEdit
                  className="mr-2 h-5 w-5"
                  aria-hidden="true"
                />
                Make Admin
              </MenuItem>
            )
          }
          {
            props.enableCalls && (
              <MenuItem>
                <BiPhoneCall
                  className={`mr-2 h-5 w-5 `}
                  aria-hidden="true"
                />
                Enable Calls
              </MenuItem>
            )
          }
          {
            props.enableCalls && (
              <MenuItem>
                <BiPhoneCall
                  className={`mr-2 h-5 w-5 `}
                  aria-hidden="true"
                />
                Enable Calls
              </MenuItem>
            )
          }
          {
            props.disableCalls && (
              <MenuItem>
                <BiPhoneOff
                  className={`mr-2 h-5 w-5 `}
                  aria-hidden="true"
                />
                Disable Calls
              </MenuItem>
            )
          }
          {
            props.removeMember && (
             <MenuItem onClick={props.removeMember}>
               <AiFillDelete
                 className={`mr-2 h-5 w-5 `}
                 aria-hidden="true"
               />
               Delete
             </MenuItem>
            )
          }
          {
            props.exitGroup && (
              <MenuItem onClick={props.exitGroup}>
                <AiFillDelete
                  className={`mr-2 h-5 w-5 `}
                  aria-hidden="true"
                />
                Delete
              </MenuItem>
            )
          }
        </Menu.Items>
      </Transition>
    </Menu>
  );
}


 function MenuItem(props:React.ButtonHTMLAttributes<HTMLButtonElement>){
  const {children,className,...rest} = props;
  return (
    <div className="px-1 py-1">
      <Menu.Item>
        {({ active }) => (
          <button
            className={`${
              active ? 'bg-emerald-900 bg-opacity-40 text-white dark:text-white' : 'text-emerald-900 dark:text-gray-200'
            } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
            {...rest}
          >
            {
              children
            }
          </button>
        )}
      </Menu.Item>
    </div>
  );
 }
