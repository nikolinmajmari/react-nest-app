import React from "react";
import {FiPause} from "react-icons/fi";
import {AiOutlineAudio} from "react-icons/ai";
import {BiTrash} from "react-icons/bi";

export function RecordPauseButton(props:React.ButtonHTMLAttributes<HTMLButtonElement>){
  return (
    <button type={'button'}  className="bg-transparent hover:bg-emerald-900 hover:bg-opacity-20 text-emerald-900 py-2 px-2  hover:border-transparent rounded"
            {...props}
    >
      <FiPause size={20}/>
    </button>
  );
}
export function RecordResumeButton(props:React.ButtonHTMLAttributes<HTMLButtonElement>){
  return (
    <button type={'button'}  className="bg-transparent hover:bg-red-900 hover:bg-opacity-20 text-red-900 py-2 px-2  hover:border-transparent rounded"
            {...props}
    >
      <AiOutlineAudio size={20}/>
    </button>
  );
}

export function RecordStopButton(props:React.ButtonHTMLAttributes<HTMLButtonElement>){
  return (
    <button type={'button'} className="bg-transparent hover:bg-red-900 hover:bg-opacity-20 text-red-900 font-semibold py-2 px-2  hover:border-transparent rounded"
            {...props}
    >
      <BiTrash size={20}/>
    </button>
  );
}
