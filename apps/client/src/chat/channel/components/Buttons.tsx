import {BiSolidCloudDownload} from "react-icons/bi";
import React from "react";


export function BackdropBlurDownloadButton(props:React.HTMLProps<HTMLAnchorElement>){
  const {className,...rest} = props;
  return (
    <a className={'rounded-full cursor-pointer ' +
      'bg-emerald-800 backdrop-blur-sm bg-opacity-30 p-1 '+
      className
    }
       {...rest}
    >
      <BiSolidCloudDownload
        className={'text-white cursor-pointer ' +
          'transition ease-in-out delay-150  hover:scale-125  duration-300'}
        size={24}/>
    </a>
  );
}
