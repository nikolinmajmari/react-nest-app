import {Dialog} from "@headlessui/react";
import Modal from "../../../components/modals/Modal";
import React, {FormEvent} from "react";
import {ChannelType, IUser} from "@mdm/mdm-core";
import {InputGroup} from "../../../components/inputs/InputGroup";
import {
  ICreateChannelModalProps,
  useGoBack,
  useNewChannelForm,
} from "./hooks";
import {Form, useLocation} from "react-router-dom";
import {useCreateChannelMutation} from "../channels.api";
import {QueryStatus} from "@reduxjs/toolkit/query";
import {ToastNotificationContext} from "../../../providers/ToastNotificationProvider";
import {UserSearchPicker} from "../../../components/users/UserSearchPicker";


export default function NewChannelModal({title, type}: ICreateChannelModalProps) {
  const location = useLocation();
  /// usefully hooks and callbacks
  const {goBack} = useGoBack();
  const toast = React.useContext(ToastNotificationContext);
  const [
    createChannel,
    {
      status,
      isUninitialized,
      isLoading,
      isSuccess,
      isError,
      error,
      reset
    }] = useCreateChannelMutation();
  /// form and pipes
  const {
    selected, toggleSelected,
    channelName, setChannelName,
    validation, validate
  } = useNewChannelForm(type);

  //// back effect
  React.useEffect(() => {
    let timeout: string | number | NodeJS.Timeout | undefined;
    if(isSuccess){
      toast?.success(`Channel created sucessfully!`);
      timeout = setTimeout(goBack)
    }
    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [goBack, status]);
  //// form submission
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validated = validate();
    if (validated !== false) {
      createChannel({
        ...validated, type
      });
    }
  }

  return (<Modal close={goBack}>
    <Dialog.Title
      as="h3"
      className="text-lg font-medium leading-6 text-gray-900"
    >
      {title}
    </Dialog.Title>
    <div className={'relative'}>
      {
        isLoading && <Loading/>
      }
      {
        !isSuccess && (<form onSubmit={handleSubmit} className="mt-2 text-sm flex flex-col">
          {
            error && (
              <div className={'bg-red-50 text-red-800 px-2 py-2 my-2 rounded-lg'}>
                {(error as any).data.message}
                {JSON.stringify(error)}
              </div>
            )
          }
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
        </form>)
      }
    </div>
  </Modal>);
}


export function Chip({user,label,index, remove}: {index:number, label: string, remove: () => void,user:IUser }) {
  return (<div
    className="center relative flex flex-row items-center bg-slate-300 select-none whitespace-nowrap rounded-lg bg-gradient-to-tr  py-1 px-2.5 align-baseline font-sans  leading-none text-slate-600
      dark:bg-gray-500 dark:bg-opacity-40 dark:shadow-lg dark:text-white
    "
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
  return (
    <div className=" absolute flex items-center justify-center px-12 py-8 w-full h-full z-50 bg-white bg-opacity-25">
    <div
      className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
      role="status">
        <span
          className="text-emerald-900 fill-blue-900 !absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
    </div>
  </div>);
}
