import React from "react";
import {useAuth, useCurrentUser} from "../app/hooks/auth";
import storage from "../core/storage";
import {WebSocketJsonRPCAdapter} from "@mdm/mdm-js-client";

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
  console.log(auth);
  const [webSocket,setWebSocket] = React.useState<WebSocket|null>(null);
  const [RPCSocket,setRPCSocket] = React.useState<WebSocketJsonRPCAdapter|null>(null);
  React.useEffect(()=>{
    if(auth.status==="succeeded" && webSocket === null){
      const token = storage.getAuthData().accessToken;
      const socket = new WebSocket('ws://localhost:3001/?bearerToken='+token);
      socket.addEventListener('message',function (ev){
        console.log('debug:event:message:',ev.data);
      })
      setWebSocket(socket);
      const rpcSocket = new WebSocketJsonRPCAdapter(socket);
      setRPCSocket(rpcSocket);
      (window as unknown as any).socket = socket;
      (window as unknown as any).rpcSocket = rpcSocket;
    }
    return ()=>{
      webSocket?.close();
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

