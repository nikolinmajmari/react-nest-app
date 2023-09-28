import Example from "../../../components/modals/Modal";
import React from "react";
import { TfiPlus } from "react-icons/tfi";
import CreateDirectChannelModal from "./new/NewChannelModal";
import { Link, useLocation } from "react-router-dom";



export default function ChannelsHeader(){
    const location = useLocation();
    return (
        <div className='header py-5 bg-white bg-opacity-20 sticky top-0 backdrop-blur-xl flex flex-row items-center h-25'>
                <input className='flex-1 mx-5 shadow-sm outline-none transition-colors rounded-2xl bg-slate-50 focus:bg-teal-50 focus:shadow-md px-4 py-2'/>
                <Link state={{previousLocation:location}} to="/chat/channels/new" className="text-green-600 bg-green-50 rounded-full outline-none focus:outline-none w-8 h-8 
                mr-4 hover:text-green-800 hover:bg-green-100
                flex items-center justify-center">
                    <TfiPlus/>
                </Link>
        </div>
    );
}
