import React from "react";

export default function ChannelGroupContainer(props:IChanelGroupContainerProps){
    const {label,children,...rest} = props;
    return (
        <div {...rest}>
                <div className="px-4 text-gray-500 text-opacity-80 font-bold text-2xl py-2 bg-slate-50">
                    {label}
                </div>
                {
                    children
                }
            </div>
    );
}

export interface IChanelGroupContainerProps extends React.HTMLAttributes<Element>{
    label:string;
    children?:any
}