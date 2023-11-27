import React from "react";
import {useAuth, useCurrentUser} from "../app/hooks/auth";
import storage from "../core/storage";
import {WebSocketJsonRPCAdapter} from "@mdm/mdm-js-client";
import {EmitterContext} from "./AppEventEmitterProvider";
import {IMessage} from "@mdm/mdm-core";
import {IWsEvent, WsEvents} from "../../../../libs/mdm-core/src/lib/ws";

export interface IWebSocketContext{
  webSocket:WebSocket|null,
  rpcSocket:WebSocketJsonRPCAdapter|null
}

export const WebSocketContext = React.createContext<IWebSocketContext>({
  webSocket:null,
  rpcSocket:null
});


export default function WebSocketConnectionProvider(props:any){
  const auth = useAuth();
  const emitter = React.useContext(EmitterContext);
  const [webSocket,setWebSocket] = React.useState<WebSocket|null>(null);
  const [RPCSocket,setRPCSocket] = React.useState<WebSocketJsonRPCAdapter|null>(null);

  const handleOnMessage = function (ev:MessageEvent){
    const parsed = JSON.parse(ev.data) as IWsEvent<any>;
    if('id' in Object.keys(parsed)){
      //// these events are handled by rpc socket
      return ;
    }
    /// let custom emitter handle the event
    emitter?.emitter.emit(parsed.event,parsed.params,parsed.data);
  }
  React.useEffect(()=>{
    if(auth.status==="succeeded" && webSocket === null){
      const token = storage.getAuthData().accessToken;
      const socket = new WebSocket('ws://localhost:3001/?bearerToken='+token);
      socket.addEventListener('message',handleOnMessage);
      setWebSocket(socket);
      const rpcSocket = new WebSocketJsonRPCAdapter(socket);
      setRPCSocket(rpcSocket);
      (window as unknown as any).socket = socket;
      (window as unknown as any).rpcSocket = rpcSocket;
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

