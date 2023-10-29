import {IMedia, MediaType} from "@mdm/mdm-core";
import React from "react";
import {PiFileFill} from "react-icons/pi";
import {TfiDownload} from "react-icons/tfi";
import {AiOutlineReload} from "react-icons/ai";
import {CircularProgressbar} from "react-circular-progressbar";
import {BackdropBlurDownloadButton} from "./Buttons";


interface IDownloadableFileProps{
  type:MediaType;
  fileName:string;
  url:string;
}

export function DownloadableFileTile(props:IDownloadableFileProps){
  return (
    <FileTile type={props.type} fileName={props.fileName} action={
      <DownloadAction
        uri={props.url+'?attachment=1'}
      />
    }/>
  );
}


interface IFileTileProps{
  type:MediaType,
  fileName:string,
  action:React.ReactNode
}
export function FileTile(props:IFileTileProps){
  const {fileName,action}= props;
  //// download a
  return (
    <div className={'\'py-1 bg-emerald-700 rounded-md bg-opacity-25 pl-2 justify-between flex flex-row items-center\' +\n' +
      '        \' dark:bg-emerald-900 dark:bg-opacity-20 dark:text-cyan-100 ' +
      ' w-64 md:w-72 lg:80'}>
      <div className={'flex flex-row justify-start items-center overflow-hidden flex-1'}>
        <PiFileFill size={18} className={'text-emerald-800'}/>
        <span className={'px-2 inline overflow-ellipsis whitespace-nowrap line overflow-hidden flex-1'}>
          {fileName}
        </span>
      </div>
      <div className={'w-10 h-10 ' +
        'flex items-center justify-center'}>
        {action}
      </div>
    </div>
  );
}

export function DownloadAction({uri}:{uri:string}){
  return (
    <BackdropBlurDownloadButton
      href={uri}
    />
  );
}

export function ActionButton(props:React.HTMLProps<HTMLDivElement>){
  const {className,children,...rest} = props;
  return (
    <div className={ className + ' ' +
      'self-center p-1 cursor-pointer' +
      ' p-2 rounded-full dark:hover:bg-gray-700 hover:bg-emerald-800 hover:bg-opacity-30'}
         {...rest}
    >
      {children}
    </div>
  );
}

export function ReloadAction({reload}:{reload:()=>void}){
  return(
    <span className={'p-2 cursor-pointer'}  onClick={reload}>
      <AiOutlineReload size={28} className={'text-emerald-700 cursor-pointer'}/>
    </span>
  );
}

export function ProgressAction({cancel,progress}:{cancel:()=>void,progress:number}){
  return (
    <span className={'p-1 cursor-pointer'}
          onClick={cancel}>
      <CircularProgressbar className={'cursor-pointer'}
                           value={progress * 100}
                           text={'X'}
      />
    </span>
  );
}
