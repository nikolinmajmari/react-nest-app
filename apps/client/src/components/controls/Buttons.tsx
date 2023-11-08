import React from "react";

export interface INavigationButtonProps{
    children?:any,
    onClick?:()=>void,
    active?:boolean;
}

export function NavigationButton({children,onClick}:INavigationButtonProps){
    return (
        <span onClick={onClick} className="p-4 text-teal-800 rounded-full font-bold text-2xl cursor-pointer hover:bg-teal-800 hover:bg-opacity-20 transition-colors
            dark:text-teal-600 dark:hover:bg-gray-700 dark:hover:bg-opacity-70 dark:bg-opacity-20
        ">
            {children}
        </span>
    )
}

export function SubmitButton(props:React.ButtonHTMLAttributes<HTMLButtonElement>){
  const {className,...rest} = props;
  return (
    <button
      className={`
      bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline
      ${className}
      `}
      type={'submit'}
      {...rest}
    >
      {props.children}
    </button>
  );
}
