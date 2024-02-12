import React from "react";


export default function SelectedOverlay(props:React.HTMLProps<HTMLDivElement>){
  const {className,...rest} = props;
  return (
    <div className={'wrapper absolute cursor-pointer z-10 px-1 flex flex-1 h-full w-full '}
    >
      <div
        className={'flex-1 bg-opacity-20 bg-slate-800 dark:bg-white dark:bg-opacity-20  rounded-lg ' +className??''}
        {...rest}
      >
      </div>
    </div>
  );
}
