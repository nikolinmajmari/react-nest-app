import { Menu } from './Menu';
import React, { ReactNode, useCallback } from 'react';
import { createPortal } from 'react-dom';
import useContextMenu from './useContextMenu';

export interface IMenuContext{
    show:boolean;
    showMenu: (node:React.ReactNode)=>void,
    hideMenu: ()=>void,
}

export const MenuContext = React.createContext<IMenuContext>({
    show: false,
    showMenu: (node:ReactNode)=>{
        ///
    },
    hideMenu(){
        ///
    }
})

export function ContextMenuProvider(props:any){
    const [show,setShow] = React.useState<boolean>(false);
    const [node,setNode] = React.useState<React.ReactNode|null>(null);
    const ref = React.useRef<HTMLDivElement>(null);
    const handleShowMenu  = (node:React.ReactNode)=>{
        setShow(true);
        setNode(node);
    }

    const handleHideMenu = ()=>{
        setShow(false);
    };

    const hideMenuOnContextMenu = useCallback(
        (event:MouseEvent)=>{
        if(show && node && !ref.current?.contains(event.target as Node)){
            event.preventDefault();
            event.stopPropagation();
            setShow(false);
        }
    },[show,node]);

    React.useEffect(()=>{
        document.addEventListener('contextmenu',hideMenuOnContextMenu);
        document.addEventListener('click',handleHideMenu);
        return ()=>{
            document.removeEventListener('contextmenu',hideMenuOnContextMenu);
            document.removeEventListener('click',handleHideMenu);
        }
    },[show, node, hideMenuOnContextMenu])
    return (
        <MenuContext.Provider value={{
                show: show,
                showMenu: handleShowMenu,
                hideMenu: handleHideMenu
            }}>
            {props.children}
            { show && node && createPortal(
                 <RefWrapper ref={ref}>{node}</RefWrapper>
                ,document.body) }
        </MenuContext.Provider>
    );
}

const RefWrapper = React.forwardRef<HTMLDivElement,any>((props:any,ref)=>{
    return (
        <div ref={ref} className=''>
            {props.children}
        </div>
    );
})

export interface IContextMenuProps{
    children?:React.ReactNode,
    trigger:React.ReactNode;
}

export const  ContextMenu = React.forwardRef<HTMLDivElement,IContextMenuProps>((props:IContextMenuProps,ref)=>{
    useContextMenu(
        ref as React.MutableRefObject<HTMLDivElement>,
        function(pos){
            return (<Menu anchorPoint={pos}>{props.children}</Menu>);
        }
    );
    return (
        <div ref={ref as React.MutableRefObject<HTMLDivElement>}>
            {props.trigger}
        </div>
    );
})
