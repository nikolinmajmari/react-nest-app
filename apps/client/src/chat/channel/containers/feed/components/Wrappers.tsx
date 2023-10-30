import React from "react";

export enum Align {
  left = "left", right = "right"
}

export interface IAlignProp {
  align: Align;
}

export function MessageBodyWrapper(props: IAlignProp & React.HTMLProps<HTMLDivElement>) {
  return (<div className="w-2/3 flex flex-row">
    <div className={`flex flex-col flex-1 items-start
            ${props.align === Align.left ? "items-start" : "items-end"}
        `}>
      {props.children}
    </div>
  </div>);
}
export function MessageWrapper(props: IAlignProp & React.HTMLProps<HTMLDivElement>) {
  const {align, className, ...rest} = props;
  return (<div {...rest} className={`flex items-start pt-6 gap-2
            ${align === Align.left ? "flex-row" : "flex-row-reverse"}`}>
    {props.children}
  </div>);
}

export function MessageContentWrapper(props: React.HTMLProps<HTMLDivElement>) {
  return (
    <div className="bubble flex flex-col items-stretch max-w-64 md:max-w-72 lg:max-w-80 bg-neutral-100 p-1 rounded-lg
    break-all dark:bg-slate-800 dark:text-white">
      {props.children}
    </div>
  );
}
