import React, { useEffect, useCallback, useState, ReactNode } from "react";
import { IMenuContext, MenuContext } from "./ContextMenu";

export type MenuBuilder = (pos:{x:number,y:number})=>React.ReactNode;

const useContextMenu:(ref:React.RefObject<HTMLDivElement>,builder:MenuBuilder)=>IMenuContext = (ref,builder) => {
  const context = React.useContext(MenuContext);
  const handleContextMenu = useCallback(
    (event:MouseEvent) => {
     if(ref.current?.contains(event.target as Node)){
        event.preventDefault();
        event.stopPropagation();
        context.showMenu(builder({ x: event.pageX, y: event.pageY }))
      }
      console.log('context menu event with ',event);
    },
    [ref, context, builder]
  );
  useEffect(() => {
    ref.current?.addEventListener("contextmenu", handleContextMenu);
    return () => {
      ref.current?.removeEventListener("contextmenu", handleContextMenu);
    };
  },[handleContextMenu, ref]);
  return { ...context };
};

export default useContextMenu;