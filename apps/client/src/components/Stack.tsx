import React from "react";

const StackContext = React.createContext<{
    pop:(()=>boolean)|null,
    push:((e:React.JSX.Element)=>boolean)|null
}>({
    pop:null,
    push:null
});


export  default function Stack(props:any){
    const [components,setComponents] = React.useState<React.JSX.Element[]>([]);
    const providerValue = {
        pop(){
            setComponents((prev)=>{
                prev.pop();
                return [...prev];
            })
            return true;
        },
        push(component:React.JSX.Element){
            setComponents((prev)=>{
                prev.push(component);
                return [...prev];
            })
            return true;
        }
    };
    return (
        <StackContext.Provider value={providerValue}>
            {props.children}
            {...components.map(c=><StackContainer>{c}</StackContainer>)}
        </StackContext.Provider>
    )
}


export function StackContainer(props:any){
    return (
        <div className="absolute top-0 left-0 w-full h-full">
            {props.children}
        </div>
    );
}