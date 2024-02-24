import React from "react";
import {useAuth} from "../app/hooks/auth";
import storage from "../core/storage";
import {IWsEvent} from "../../../../libs/mdm-core/src/lib/ws";
import emitter from "../util/app.emitter";
import {WSRPCAdapter} from "@mdm/ws-rpc-adapter";
import {ToastNotificationContext} from "./ToastNotificationProvider";
import {FiRefreshCcw} from "react-icons/fi";
export interface IWebSocketContext{
  socket:WebSocket|null,
  rpc:WSRPCAdapter|null,
}

export const WebSocketContext = React.createContext<IWebSocketContext>({
  socket: null,
  rpc: null,
});

enum ConnectionState{
  idle,
  waiting,
  on,
  off
}

function useConnectionState(){
  const [connection,setConnection] = React.useState<ConnectionState>(
    ConnectionState.idle
  );
  return {
    value: connection,
    setWaiting: ()=>setConnection(ConnectionState.waiting),
    setOn:()=>setConnection(ConnectionState.on),
    setOff:()=>setConnection(ConnectionState.off),
    setIdle:()=>setConnection(ConnectionState.idle),
    isWaiting:()=>connection===ConnectionState.waiting,
    isIdle:()=>connection===ConnectionState.idle,
    isOff:()=>connection===ConnectionState.off,
    isOn:()=>connection===ConnectionState.on,
  }
}

function useCountDownState(){
  const [count,setCount] = React.useState<number>(1);
  const counterRef = React.useRef(1);
  return {
    count,
    toSeconds(){
      return count*1000
    },
    double(){
      setCount(old=>old*2);
      counterRef.current = count*2;
    },
    reset(){
      setCount(1);
      counterRef.current = 1;
    },
    counter:{
      decrement(){
        counterRef.current--;
      },
      get value(){
        return counterRef.current;
      },
      get seconds(){
        return counterRef.current *1000;
      }
    }
  }
}

function useConnectionCountDown(){
  const connection = useConnectionState();
  const countDown = useCountDownState();
  const counterRef = React.useRef<HTMLSpanElement>(null);
  const counterInterval = React.useRef<NodeJS.Timer|undefined>(undefined);
  const counterTimeout = React.useRef<NodeJS.Timeout|undefined>(undefined);
  React.useEffect(()=>{
    if(connection.isWaiting()){
      const interval = setInterval(
        ()=>{
          countDown.counter.decrement();
          counterRef.current!.innerHTML = countDown.counter.value.toString();
        },1000
      );
      const timeout = setTimeout(
        ()=>{
          clearInterval(counterInterval.current);
          countDown.double();
          connection.setIdle();
        },countDown.toSeconds()
      );
      counterInterval.current = interval;
      counterTimeout.current = timeout;
      return ()=>{
        clearInterval(interval);
        clearTimeout(timeout);
      }
    }
  },[connection,countDown,counterTimeout,counterInterval,counterRef]);
  return {
    connection,
    countDown,
    counterRef,
    forward:()=>{
      connection.setIdle();
      countDown.double();
    }
  }
}

export default function WebSocketConnectionProvider(props:any){
  const auth = useAuth();

  /// connection & countdown
  const {
    connection,
    countDown,
    counterRef,
    forward,
  } = useConnectionCountDown();
  const [webSocket,setWebSocket] = React.useState<WebSocket|null>(null);
  const [rpc,setRpc] = React.useState<WSRPCAdapter|null>(null);

  const handleOnMessage = function (ev:MessageEvent){
    const parsed = JSON.parse(ev.data) as IWsEvent<any>;
    emitter.emit(parsed.event,{
      ...parsed
    });
  }

  const handleOnClose = function (ev:CloseEvent){
    if(auth.status==='succeeded'){
      if(connection.value===ConnectionState.on || connection.value===ConnectionState.idle){
        /// on failure double countdown
        connection.setWaiting();
      }else{
        //// do nothing if connection is already waiting
      }
    }else {
      connection.setOff();
    }
  }

  React.useEffect(()=>{
    if(auth.status==="succeeded" && connection.isIdle() && storage.getAuthData()){
      const token = storage.getAuthData().accessToken;
      const socket = new WebSocket('ws://localhost:3001/?bearerToken='+token);
      socket.addEventListener('message',handleOnMessage);
      socket.addEventListener('close',handleOnClose);
      socket.addEventListener('open',()=>{
        connection.setOn();
        countDown.reset();
      })
      // @ts-ignore
      setWebSocket(socket);
      const rpcSocket = new WSRPCAdapter(socket);
      // @ts-ignore
      setRpc(rpcSocket);
      if(window){
        (window as unknown as any).socket = socket;
        (window as unknown as any).rpcSocket = rpcSocket;
      }
    }
  },[connection.value,auth.status,countDown.count]);
  React.useEffect(()=>{
    return ()=>{
      if(webSocket){
        webSocket?.removeEventListener('message',handleOnMessage);
        webSocket?.removeEventListener('close',handleOnClose);
        webSocket?.close();
      }
    }
  },[]);
  return (
    <WebSocketContext.Provider value={
      {
        socket: webSocket,
        rpc: rpc
      }
    }>
      {
        connection.isWaiting() && (
          <div className={'bg-yellow-100 w-full flex flex-row justify-center items-center gap-4 py-2 text-sm text-yellow-800'}>
            <label>
              Trying to reconnect on <span ref={counterRef}>{countDown.counter.value}</span> seconds
            </label>
            <span onClick={forward} className={'hover:bg-yellow-900 hover:bg-opacity-10 cursor-pointer rounded-full px-1 py-1'}>
              <FiRefreshCcw/>
            </span>
          </div>
        )
      }
      {props.children}
    </WebSocketContext.Provider>
  );
}

