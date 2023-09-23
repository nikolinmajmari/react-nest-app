import React from "react";
import { TfiReload } from "react-icons/tfi";

export interface IErrorComponent{
    resolve?:()=>void,
    error?:any,
    effect?:()=>(void|(()=>void));
}

export default function ErrorComponent(props:IErrorComponent){
    const {error,resolve,effect} = props;
    React.useEffect(()=>{
        if(effect){
            return effect();
        }
    });
    return (
        <div className="flex flex-1 justify-center items-stretch flex-col">
            <div className="flex flex-col items-stretch justify-around">
               <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 my-8" role="alert">
                    <p className="font-bold">Error</p>
                    <p>{error}</p>
              </div>
                {
                    resolve ? 
                    (
                        <button onClick={resolve} className="mt-6 flex flex-col px-6 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600">
                            <span className="flex flex-row items-center">
                                <TfiReload/>&nbsp;&nbsp;<label>Reload</label>
                            </span>
                        </button>
                    )
                    :
                    null
                }
            </div>
        </div>
    );
}