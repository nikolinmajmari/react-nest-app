import React from "react";
import {motion} from "framer-motion";
export interface INavigationHeaderProps{
    children?:any,
    leading:React.ReactElement;
    title?:string;
}

export function NavigationHeader(props:INavigationHeaderProps){
    return (
          <div className="bg-teal-700 shadow-lg bg-opacity-30 sticky top-0 backdrop-blur-xl flex flex-row items-center
            dark:bg-gray-900 dark:text-white z-10 font-bold dark:bg-opacity-60
          ">
               <motion.div
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   exit={{ opacity: 0 }}
                   className={'h-20 flex flex-row items-center justify-between w-full'}
               >
                   <div className="navigation gap-5 flex flex-row justify-start items-center px-2">
                       {props.leading}
                     <span className={'text-xl text-emerald-900'}>
                      {props.title}
                     </span>
                   </div>
                   <div className="actions flex flex-row justify-start items-center px-4">
                       {props.children}
                   </div>
               </motion.div>
            </div>
    );
}

export default React.memo(NavigationHeader);
