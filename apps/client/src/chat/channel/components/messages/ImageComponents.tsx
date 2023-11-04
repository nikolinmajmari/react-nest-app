import React from "react";
import { AiOutlineCloudDownload } from "react-icons/ai";
import {FaDownload} from "react-icons/fa";
import {BiSolidCloudDownload} from "react-icons/bi";
import {BackdropBlurDownloadButton} from "../Buttons";

export function IUploadingImage(){
  return (
    <div></div>
  );
}

export interface IImageMessageProps{
  url:string;
  thumbnail:string;
}
export function MessageContentImage(props:IImageMessageProps) {
  // eslint-disable-next-line jsx-a11y/alt-text
  return (
    <div className={'relative'}>
      <BackdropBlurDownloadButton
        className={'absolute bottom-1 right-1'}
        href={props.url+'?attachment=1'}
      />
      <a href={props.url} target={'_blank'}>
        <img loading={'lazy'} src={props.thumbnail??props.url} className="cursor-pointer
          h-48  w-64 md:w-72 lg:80 object-cover rounded-lg rounded-t-lg rounded-b-none
        "/>
      </a>
    </div>
  );
}


