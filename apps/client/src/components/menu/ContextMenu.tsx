import { Menu } from './Menu';
import React, { ReactNode } from 'react';
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
    const handleShowMenu  = (node:React.ReactNode)=>{
        console.log('showing',node);
        setShow(true);
        setNode(node);
    }
    const handleHideMenu = ()=>setShow(false);
    return (
        <MenuContext.Provider value={{
                show: show,
                showMenu: handleShowMenu,
                hideMenu: handleHideMenu
            }}>
            {props.children}
            { show && node && createPortal(
                 node
                ,document.body) }
        </MenuContext.Provider>
    );
}

export interface IContextMenuProps{
    children?:any
}

export const ContextMenu = React.forwardRef((props:IContextMenuProps,ref)=>{
    useContextMenu(
        ref,
        function(pos){
            return (<Menu anchorPoint={pos}>{props.children}</Menu>);
        }
    );
    return (
        // eslint-disable-next-line react/jsx-no-useless-fragment
        <></>
    )
});
