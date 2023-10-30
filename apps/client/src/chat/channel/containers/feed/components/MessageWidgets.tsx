import React from "react";
import {Align, IAlignProp} from "./Wrappers";
import {IUser} from "@mdm/mdm-core";


export function MessageAvatar(props: React.HTMLProps<HTMLDivElement>) {
  const {className, ...rest} = props;
  return (
    <div {...rest}
         className={`avatar mt-2 flex items-center justify-center  bg-teal-400 text-white mx-2 rounded-full h-12 w-12 ${className} first-letter:
           dark:bg-gray-600
           `}>
      <span className="text-2xl">A</span>
    </div>
  );
}


export function MessageTextContent(props: React.HTMLProps<HTMLDivElement>) {
  if (!props.children) {
    return <></>;
  }
  return (
    <div className="px-2 py-1 break-words break-all w-full">
      {props.children}
    </div>
  );
}

export interface IMessageHeaderProps extends IAlignProp {
  sender: IUser;
  timestamp: string;
}

export function MessageHeader(props: IMessageHeaderProps) {
  return (
    <div className={`py-1 flex items-baseline gap-4
           ${props.align === Align.left ? 'flex-row' : "flex-row-reverse"}
           `}>
    <span
      className="text-md font-semibold text-gray-800 dark:text-gray-100">{`${props.sender.firstName} ${props.sender.lastName}`}</span>
    <span className="text-xs text-gray-700 dark:text-gray-300 text-opacity-70">{props.timestamp}</span>
  </div>);
}

