import Example from "../../../components/modals/Modal";
import { ModalContext } from "../../../components/OldModal";
import React from "react";
import { TfiPlus } from "react-icons/tfi";
import CreateDirectChannelModal from "./CreateDirectChannelModal";



export default function ChannelsHeader(){
    const [open,setOpen] = React.useState(false);
    const openAddUserModal = ()=>{
       setOpen(true);
    }
    return (
        <>
        <div className='header py-5 bg-white bg-opacity-20 sticky top-0 backdrop-blur-xl flex flex-row items-center h-25'>
                <input className='flex-1 mx-5 shadow-sm outline-none transition-colors rounded-2xl bg-slate-50 focus:bg-teal-50 focus:shadow-md px-4 py-2'/>
                <button onClick={openAddUserModal} className="text-green-600 bg-green-50 rounded-full outline-none focus:outline-none w-8 h-8 
                mr-4 hover:text-green-800 hover:bg-green-100
                flex items-center justify-center">
                    <TfiPlus/>
                </button>
        </div>
        {
            open?<CreateDirectChannelModal {...{open,setOpen}}/>:null
        }
        </>
    );
}
