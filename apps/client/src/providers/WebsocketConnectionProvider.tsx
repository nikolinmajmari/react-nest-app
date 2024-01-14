import React from "react";
import {useAuth} from "../app/hooks/auth";
import storage from "../core/storage";
import {IWsEvent} from "../../../../libs/mdm-core/src/lib/ws";
import emitter from "../util/app.emitter";
import {WSRPCAdapter} from "@mdm/ws-rpc-adapter";
export interface IWebSocketContext{
  webSocket:WebSocket|null,
  rpcSocket:WSRPCAdapter|null
}

export const WebSocketContext = React.createContext<IWebSocketContext>({
  webSocket:null,
  rpcSocket:null
});


export default function WebSocketConnectionProvider(props:any){
  const auth = useAuth();
  const [webSocket,setWebSocket] = React.useState<WebSocket|null>(null);
  const [RPCSocket,setRPCSocket] = React.useState<WSRPCAdapter|null>(null);

  const handleOnMessage = function (ev:MessageEvent){
    const parsed = JSON.parse(ev.data) as IWsEvent<any>;
    /// let custom emitter handle the event

    console.log('on message',parsed);
    emitter.emit(parsed.event,{
      ...parsed
    });
  }
  React.useEffect(()=>{
    if(auth.status==="succeeded" && webSocket === null){
      const token = storage.getAuthData().accessToken;
      const socket = new WebSocket('ws://localhost:3001/?bearerToken='+token);
      socket.addEventListener('message',handleOnMessage);
      setWebSocket(socket);
      const rpcSocket = new WSRPCAdapter(socket);
      setRPCSocket(rpcSocket);
      if(window){
        (window as unknown as any).socket = socket;
        (window as unknown as any).rpcSocket = rpcSocket;
      }
    }
    return ()=>{
      webSocket?.close();
      webSocket?.removeEventListener('message',handleOnMessage);
    }
  },[webSocket,auth.status]);
  return (
    <WebSocketContext.Provider value={
      {webSocket: webSocket,rpcSocket: RPCSocket}
    }>
      {props.children}
    </WebSocketContext.Provider>
  );
}

