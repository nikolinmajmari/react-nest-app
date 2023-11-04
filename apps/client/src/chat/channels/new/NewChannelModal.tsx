import {Dialog} from "@headlessui/react";
import Modal from "../../../components/modals/Modal";
import React, {FormEvent, useCallback} from "react";
import {ChannelType, IChannel, IChannelCreate, IUser} from "@mdm/mdm-core";
import {SearchComponent, SearchedUserItem} from "../../../components/inputs/Search";
import ErrorComponent from "../../../components/ErrorComponent";
import {InputGroup} from "../../../components/inputs/InputGroup";
import AsyncRender from "../../../components/core/AsyncRender";
import {useDispatchCreateChannel} from "../../../app/hooks/channels";
import { useAsyncHook} from "../../../app/hooks/core";
import {
  ICreateChannelModalProps,
  useCustomEffectOnSuccessOrFailure,
  useGoBack,
  useNewChannelForm,
  useSearchUser
} from "./hooks";
import {Form, useLocation} from "react-router-dom";


export default function NewChannelModal({title, type}: ICreateChannelModalProps) {
  const location = useLocation();
  /// usefully hooks and callbacks
  const {goBack} = useGoBack();
  const createChannel = useDispatchCreateChannel(type);
  /// form and validation
  const {
    selected, toggleSelected,
    channelName, setChannelName,
    validation, validate
  } = useNewChannelForm(type);
  /// async operation
  const {
    status, error, startAsyncHook
  } = useAsyncHook<IChannelCreate, IChannel>(async (data) => createChannel(data!).unwrap());
  //// back effect
  useCustomEffectOnSuccessOrFailure(status, error);
  //// form submission
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = validate();
    if (result !== false) {
      startAsyncHook(result).then(() => 1);
    }
  }

  return (<Modal close={goBack}>
    <Dialog.Title
      as="h3"
      className="text-lg font-medium leading-6 text-gray-900"
    >
      {title}
    </Dialog.Title>
    <AsyncRender
      success={<div>Channel created successfully</div>}
      failed={<ErrorComponent error={error?.message}/>}
      status={status}
      loading={<Loading/>}
    >
      <form onSubmit={handleSubmit} className="mt-2 text-sm flex flex-col">
        <UserSearchPicker
          selected={selected}
          toggleSelected={toggleSelected}
          multiple={type === ChannelType.group}
          error={validation.selected}
        />
        {type === ChannelType.group && (<InputGroup
          label="Room Name"
          controlId="room_name"
          name={'alias'}
          value={channelName}
          onChange={(e) => setChannelName(e.target.value)}
          placeholder="Type Name Here"
          error={validation.name}
          required
        />)}
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit">
          Create
        </button>
      </form>
    </AsyncRender>
  </Modal>);
}


export interface IUserSearchPickerProps {
  selected: IUser[],
  toggleSelected: (_:IUser)=>void;
  multiple: boolean;
  error?: string | undefined;
}

export function UserSearchPicker({selected, toggleSelected, error, multiple}: IUserSearchPickerProps) {
  const {
    search, setSearch, results,
  } = useSearchUser();
  return (
    <div className="flex flex-col items-stretch justify-start">
      <SearchComponent value={search}
                       onChange={(e) => setSearch(e.target.value)}
                       type="search"
                       id="default-search"
                       placeholder="Search Users"/>
      <div className="flex flex-row gap-2 py-2 px-2 flex-wrap">
        {
          selected.map((user,index) =>
            <Chip remove={() => toggleSelected(user)}
                  user={user}
                  index={index}
                  label={`${user.firstName} ${user.lastName}`}/>
          )
        }
      </div>
      <div className="results flex flex-col overflow-y-auto mb-4 h-64">
        {
          results.map(user =>
            <SearchedUserItem  key={user.id}
                             user={user}
                             selected={selected.findIndex(u => u.id === user.id) !== -1}
                             onPress={() => toggleSelected(user)}/>
          )
        }
        <p className="text-red-500 text-xs italic">{error}</p>
      </div>
  </div>)
}


export function Chip({user,label,index, remove}: {index:number, label: string, remove: () => void,user:IUser }) {
  return (<div
    className="center relative flex flex-row items-center bg-slate-300 select-none whitespace-nowrap rounded-lg bg-gradient-to-tr  py-1 px-2.5 align-baseline font-sans  leading-none text-slate-600"
  >
    <div className="mr-5 mt-px text-xs" style={{fontSize: "11px"}}>{label}</div>
    <div
      onClick={() => remove()}
      className="absolute top-1 right-1 mx-px mt-[0.5px] w-max rounded-md bg-slate-860 transition-colors hover:bg-slate-500"
    >
      <input type={'hidden'} name={`members[]`} value={user.id}/>
      <div className="w-3 h-3 cursor-pointer">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="3"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M6 18L18 6M6 6l12 12"
          ></path>
        </svg>
      </div>
    </div>
  </div>)
}

export function Loading() {
  return (<div className="flex flex-row justify-center px-12 py-8">
    <div
      className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
      role="status">
        <span
          className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
    </div>
  </div>);
}
