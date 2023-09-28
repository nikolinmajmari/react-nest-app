import React from "react";
import { IconType } from "react-icons/lib";

export interface MenuItemProps{
    icon: IconType,
    onClick: React.MouseEventHandler<HTMLDivElement> | undefined;
    children?:any;
}
export function MenuItem(props:MenuItemProps){
    return (
    <div onClick={props.onClick} className="py-1 flex flex-row px-1 items-center bg-opacity-10 hover:bg-slate-200 hover:bg-opacity-80 cursor-pointer">
        <span className="px-2">{props.icon({size:22})}</span>
        <div className="text-gray-700 block px-4 py-2 text-sm">{props.children}</div>
    </div>
    );
}


export function MenuHeader(props:Partial<MenuItemProps>){
    return (
    <div onClick={props.onClick} className="py-1 flex flex-row px-1 items-center bg-opacity-10 hover:bg-slate-200 hover:bg-opacity-80 cursor-pointer">
        <div className="text-gray-700 text-center text-md font-bold block px-4 py-2">{props.children}</div>
    </div>
    );
}


export interface MenuProps{
    anchorPoint: {x:number;y:number};
    children?:any;
}
export function Menu(props:any&MenuProps){
    return (
        <div style={{ top: props.anchorPoint.y, left: props.anchorPoint.x }} 
        className="absolute z-10 w-56 divide-y divide-gray-100 rounded-md  shadow-2xl 
        ring-1 ring-black bg-white backdrop-blur-lg bg-opacity-40 ring-opacity-5 focus:outline-none" 
        >
            {props.children}
        </div>
    );
}
