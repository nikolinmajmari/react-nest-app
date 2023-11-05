import {BiSolidCloudDownload} from "react-icons/bi";
import React from "react";


export interface IBackdropBlurDownloadButtonProps extends React.HTMLProps<HTMLAnchorElement>{
  iconSize?:number
}
export function BackdropBlurDownloadButton(props:IBackdropBlurDownloadButtonProps){
  const {className,...rest} = props;
  return (
    <a className={'rounded-full border-none outline-none cursor-pointer flex items-center justify-center ' +
      'bg-emerald-800 backdrop-blur-sm bg-opacity-30 p-1 '+
      className
    }
       {...rest}
    >
      <BiSolidCloudDownload
        className={'text-white cursor-pointer ' +
          'transition ease-in-out delay-150  hover:scale-125  duration-300'}
        size={props.size??24}/>
    </a>
  );
}
