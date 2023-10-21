import React from "react";
import {TfiPlus} from "react-icons/tfi";
import {Link, useLocation} from "react-router-dom";


export default function ChannelsHeader() {
  const location = useLocation();
  return (
    <div
      className='header py-5 bg-white bg-opacity-10 sticky top-0 backdrop-blur-xl flex flex-row items-center h-25 dark:bg-gray-950 dark:bg-opacity-30 dark:shadow-xl'>
      <input
        className='flex-1 mx-5 shadow-sm outline-none transition-colors rounded-2xl bg-slate-50 focus:bg-teal-50 focus:shadow-md px-4 py-2 dark:bg-slate-700 dark:focus:bg-slate-800 dark:text-white'/>
      <Link state={{previousLocation: location}} to="/chat/channels/new" className="text-green-600 bg-green-50 rounded-full outline-none focus:outline-none w-8 h-8
                mr-4 hover:text-green-800 hover:bg-green-100
                dark:bg-gray-600 dark:text-green-200
                dark:hover:bg-gray-700 dark:hover:text-green-100

                flex items-center justify-center">
        <TfiPlus/>
      </Link>
    </div>
  );
}
