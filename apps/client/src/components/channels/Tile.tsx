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

const ChatTile = React.forwardRef(
  function(props:IChatTileProps,ref){
    return (
         <div ref={ref} onClick={props.navigate} className={`${props.active?"bg-stone-200":""} room  cursor-pointer px-6 py-4 flex flex-row hover:bg-stone-100 transition-colors shadow-sm`}>
            <div className='avatar w-14 h-14 flex items-center justify-center rounded-full text-white bg-teal-600'>
              <span className='text-white text-xl m-auto'>{props.avatar}</span>
            </div>
            <div className='flex flex-col flex-1 px-4 items-start justify-start'>
              <span className='text-gray-700 font-bold text-lg'>{props.name}</span>
              <span className='text-xs text-gray-600'>{props.label}</span>
            </div>
            <span onClick={props.onClick}>
              <TfiMenuAlt className='cursor-pointer'/>
            </span>
          </div>
    );
}
);
export default ChatTile;