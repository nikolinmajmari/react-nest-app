import React from "react";

export interface INavigationHeaderProps{
    children:any,
    leading:React.ReactElement
}

export function NavigationHeader(props:any){
    return (
          <div className=" bg-teal-700 shadow-lg bg-opacity-30 sticky top-0 backdrop-blur-xl flex flex-row items-center
            dark:bg-gray-900 dark:text-white z-10  font-bold dark:bg-opacity-60
          ">
               <div className="h-20 flex flex-row items-center justify-between w-full">
                <div className="navigation flex flex-row justify-start items-center px-2">
                    {props.leading}
                </div>
                <div className="actions flex flex-row justify-start items-center px-4">
                    {props.children}
                </div>
               </div>
            </div>
    );
}

export default React.memo(NavigationHeader);
