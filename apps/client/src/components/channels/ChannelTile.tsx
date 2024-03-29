import React from "react";
import { TfiMenu, TfiMenuAlt } from "react-icons/tfi";

export interface IChatTileProps{
    key?:any,
    avatar:string,
    name: string,
    active:boolean,
    label:string,
    navigate:()=>void,
    onClick?: ()=>void,
}

const ChannelTile = React.forwardRef(
  function(props:IChatTileProps,ref){
    return (
         <div ref={ref as React.MutableRefObject<HTMLDivElement>} onClick={props.navigate} className={`${props.active?"" +
           "bg-stone-100 dark:bg-gray-600":""} room  cursor-pointer w-full px-6 py-4 flex flex-row hover:bg-stone-100 transition-colors shadow-sm
            dark:hover:bg-gray-700 overflow-hidden
         `}>
            <div className='avatar w-14 h-14 flex items-center justify-center rounded-full text-white bg-teal-600 dark:bg-teal-800'>
              <span className='text-white text-xl m-auto overflow-hidden'>{props.avatar}</span>
            </div>
            <div className='flex flex-col flex-1 px-4 items-start justify-start overflow-hidden'>
              <span className='text-gray-700 font-bold text-lg dark:text-gray-100'>{props.name}</span>
              <span className='text-xs text-gray-600 dark:text-gray-200 whitespace-nowrap text-ellipsis overflow-hidden'>{props.label}</span>
            </div>
            <span onClick={props.onClick} className="dark:text-white">
              <TfiMenuAlt className='cursor-pointer'/>
            </span>
          </div>
    );
}
);
export default ChannelTile;
