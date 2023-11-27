import React, {FunctionComponent} from "react";

export interface IMultiProviderProps{
  children?:React.ReactNode;
  providers:FunctionComponent<any>[],
}

export default function MultiProvider(props:IMultiProviderProps){
  let wrapped:unknown = (<>{props.children}</>)

  props.providers.reverse().forEach(function (func){
    wrapped = func({children:wrapped});
  });
  return (
    <>
      {wrapped}
    </>
  );
}
