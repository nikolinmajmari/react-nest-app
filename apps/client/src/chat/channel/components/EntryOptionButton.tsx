import React from "react";

export default function EntryOptionButton(props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>) {
  const {className, ...rest} = props;
  return (<span
    className="entry_option_button text-sm cursor-pointer text-white bg-gray-600 hover:bg-gray-700 px-1 py-2 rounded-md mx-1 bg-opacity-30"
    {...rest}
  >
            <style>{`svg path { stroke: white } .entry_option_button *{cursor:pointer}`}</style>
    {props.children}
        </span>)
}
