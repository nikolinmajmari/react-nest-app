import React, { useEffect, useCallback, useState, ReactNode } from "react";
import { IMenuContext, MenuContext } from "./ContextMenu";

export type MenuBuilder = (pos:{x:number,y:number})=>React.ReactNode;

const useContextMenu:(ref:React.RefObject<HTMLDivElement>,builder:MenuBuilder)=>IMenuContext = (ref,builder) => {
  const context = React.useContext(MenuContext);
  const handleContextMenu = useCallback(
    (event:MouseEvent) => {
     if(ref.current?.contains(event.target as Node)){
        event.preventDefault();
        context.showMenu(builder({ x: event.pageX, y: event.pageY }))
      }else if(context.show){
        event.preventDefault();
        context.hideMenu();
      }
    },
    [ref, context, builder]
  );

  const handleClick = useCallback((e:MouseEvent) => {
    context.hideMenu();
  }, [context]);

  useEffect(() => {
    document.addEventListener("click", handleClick);
    document.addEventListener("contextmenu", handleContextMenu);
    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  },[handleClick, handleContextMenu]);
  return { ...context };
};

export default useContextMenu;