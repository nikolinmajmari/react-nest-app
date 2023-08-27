import { animated, useTransition } from "@react-spring/web";
import React, { forwardRef } from "react";
import { useSpringOpacity } from "../hooks/springs.hooks";


export const ModalContext = React.createContext<ModalContextValue>({
    showModal:(a)=>(<></>),
    hideModal:()=>0,
});


export interface ModalContextValue{
    showModal:(a:()=>React.ReactElement)=>void,
    hideModal:()=>void,
    show?:boolean,
}


export interface ModalState{
     show?:boolean,
     builder?: ()=>React.ReactElement
}

export function ModalProvider(props:any){

    const [modal,setModal] = React.useState<ModalState>({});
    const ref = React.useRef(null);
    const handleOverlayClick = (e:any)=>{
        if(e.target === ref.current){
            /// overlay clicked, remove modal
            setModal((prev)=>{
                return {
                    ...prev,
                    show:false
                }
            })
        }
    }
    return (
        <ModalContext.Provider value={
            {
                hideModal(){
                   setModal((prev)=>{
                    return {
                        ...prev,
                        show:false
                    }
                   })
                },
                showModal(builder) {
                    setModal((prev)=>{
                    return {
                        ...prev,
                        show:true,
                        builder
                    };
                   })
                },
            }
        }>
            <div className="relative flex flex-1">
            {props.children}
            {
                modal.show? <Overlay ref={ref} onClick={handleOverlayClick}>
                    {modal.builder!==undefined ? modal.builder():null}
                </Overlay>:null
            }
            </div>
        </ModalContext.Provider>
    );
}

const Overlay = forwardRef(
    function(props:any,ref){
    const springs = useSpringOpacity();
    return (
    <animated.div style={springs} ref={ref} onClick={props.onClick} className="absolute z-10 w-full h-full bg-gray-600 bg-opacity-25 flex flex-1 items-center justify-center">
        {props.children}
    </animated.div>
    );
}
)


export default function Modal(props:any){
    return ( 
    <div className="h-2/3 flex w-1/3 flex-col bg-white roudned rounded-2xl p-4">
        {props.children}
    </div>);
}





