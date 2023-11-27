import { ev } from "@mdm/mdm-core";
import React from "react";

export interface IEmitterContext{
  emitter:ev.EventEmitter
}

const emitter = new ev.EventEmitter();

export const EmitterContext = React.createContext<IEmitterContext|null>(null);

export default function AppEventEmitterProvider(props:any){
  return (
    <EmitterContext.Provider
      value={{ emitter }}
    >
      {props.children}
    </EmitterContext.Provider>
  );
}
