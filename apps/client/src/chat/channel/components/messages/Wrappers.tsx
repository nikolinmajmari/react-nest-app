import React from "react";
import {useLongPress} from "use-long-press";

export enum Align {
  left = "left", right = "right"
}

export interface IAlignProp {
  align: Align;
}

export function MessageBodyWrapper(props: IAlignProp & React.HTMLProps<HTMLDivElement>) {
  return (<div className="w-2/3 flex flex-row py-1">
    <div className={`flex flex-col flex-1 items-start
            ${props.align === Align.left ? "items-start" : "items-end"}
        `}>
      {props.children}
    </div>
  </div>);
}
export function MessageWrapper(props: IAlignProp & React.HTMLProps<HTMLDivElement> & {reduced:boolean}) {
  const {align, className,reduced, ...rest} = props;
  return (
    <div className={` ${!reduced ? 'pt-1':''} mb-1 `}>
      <div  {...rest} className={`flex items-start gap-2 relative
              ${align === Align.left ? "flex-row" : "flex-row-reverse"}`}>
        {props.children}
      </div>
    </div>
  );
}

export function MessageContentWrapper(props: React.HTMLProps<HTMLDivElement>) {
  return (
    <div className="bubble flex flex-col items-stretch max-w-64 md:max-w-72 lg:max-w-80 bg-neutral-100 p-1 rounded-lg
    break-all dark:bg-slate-800 dark:text-white">
      {props.children}
    </div>
  );
}
