import React from "react";
import {useLongPress} from "use-long-press";
export interface ISelectedContext{
  selected:string[],
  select(item:string):void;
  unSelect(item:string):void;
  toggle(item:string):void;
  isSelected(item:string):boolean;
  clear():void;
}

export const SelectedContext = React.createContext<ISelectedContext>({
  selected: [],
  clear(): void {
  },
  isSelected(item: string): boolean {
    return false;
  },
  select(item: string): void {
  },
  toggle(item: string): void {
  },
  unSelect(item: string): void {
  }
});


export function SelectedContextProvider(props:any){
  const [selected,setSelected] = React.useState<string[]>([]);

  const isSelected = (item:string)=>selected.indexOf(item)!==-1;
  const select = (item:string)=>{
    console.log('select',item);
    if(!isSelected(item)){
      setSelected([...selected,item])
    }
  }
  const toggle = (item:string)=>{
    if(isSelected(item)){
      unSelect(item);
    }else{
      select(item);
    }
  }
  const unSelect = (item:string)=>{
    console.log('unselect',item);
    setSelected((old)=>old.filter(i=>i!==item));
  }

  const clear = ()=>{
    setSelected([]);
  }
  return (
    <SelectedContext.Provider value={{
      selected,isSelected,select,unSelect,toggle,clear
    }}>
      {props.children}
    </SelectedContext.Provider>
  )
}
