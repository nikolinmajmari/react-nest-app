import { TfiMenu, TfiMenuAlt } from "react-icons/tfi";
import { Link } from "react-router-dom";


export interface IChatTileProps{
    avatar:string,
    name: string,
    label:string,
}

export default function ChatTile(props:IChatTileProps){
    return (
         <Link to={"channels/12"}>
          <div className='room cursor-pointer px-6 py-4 flex flex-row hover:bg-stone-100 transition-colors shadow-sm'>
            <div className='avatar w-14 h-14 flex items-center justify-center rounded-full text-white bg-teal-600'>
              <span className='text-white text-xl m-auto'>{props.avatar}</span>
            </div>
            <div className='flex flex-col flex-1 px-4 items-start justify-start'>
              <span className='text-gray-700 font-bold text-lg'>{props.name}</span>
              <span className='text-xs text-gray-600'>{props.label}</span>
            </div>
            <div>
              <TfiMenuAlt className='cursor-pointer'/>
            </div>
          </div>
         </Link>
    );
}