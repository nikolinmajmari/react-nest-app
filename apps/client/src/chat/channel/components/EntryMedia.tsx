import {ActionButton, FileTile} from "./messages/FileComponents";
import {MediaType} from "@mdm/mdm-core";
import {AiOutlineClose} from "react-icons/ai";
import React from "react";

export interface IEntryMediaProps{
  name:string,
  type:MediaType,
  clear:()=>void,
}

export default function EntryMedia(props: IEntryMediaProps){
  return (
    <div className="media-container flex flex-row flex-wrap px-4 pb-2">
      <FileTile
        type={props.type}
        fileName={props.name}
        action={
          <ActionButton onClick={props.clear}>
            <AiOutlineClose size={18}/>
          </ActionButton>
        }
      />
    </div>
  );
}
