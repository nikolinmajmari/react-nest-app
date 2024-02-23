import {DeepResolve, IChannel, IMessage, IMessageEntity, ws} from "@mdm/mdm-core";
import React, {DependencyList} from "react";
import {IAppEvent, middlewares} from "@mdm/event-emitter";
import emitter from "../util/app.emitter";


export function useOnChannelMessageReceivedEffect(
  channel:IChannel,
  callback:(data: DeepResolve<IMessageEntity>)=>any,
  deps:DependencyList=[]
){
  const onMessageReceived = React.useCallback((e:IAppEvent<IMessage, any>)=>{
    setTimeout(()=> callback(e.data));
  },[channel,callback,...deps]);
  React.useEffect(()=>{
    emitter.on(ws.WsEvents.CHANNEL_MESSAGE_CREATED,
      middlewares.looseMatch({channel:channel!.id}),
      onMessageReceived
    );
    return ()=>{
      emitter.remove(ws.WsEvents.CHANNEL_MESSAGE_CREATED,onMessageReceived);
    }
  },[emitter,channel.id,onMessageReceived]);
}
