import {AiOutlineSend} from "react-icons/ai";
import React from "react";


export function EntrySubmitButton(props:{disabled:boolean}){
  return (
    <button
      type="submit"
      disabled={props.disabled}
      className="mx-2 bg-teal-800 hover:bg-teal-900 text-white p-4 rounded-full ">
      <AiOutlineSend/>
    </button>
  );
}
