export interface IWsRequest<T> extends IWsEvent<T>{
  id?:string;
}

export interface IWsResponse<R extends any,E extends any>{
  id?:string;
  result?:R;
  error?:E;
}

export interface IWsEvent<T extends any>{
  event: string;
  data:T;
  params?:any;
}

export enum WsEvents{
  CHANNEL_MESSAGE_CREATE='ws.channel.message.create',
  CHANNEL_MESSAGE_CREATED='ws.channel.message.created',
  CHANNEL_IN_CHAT='ws.channel.inChat',
  CHANNEL_LEAVE_CHAT='ws.channel.leaveChat',
  CHANNEL_MESSAGE_DELETED="ws.channel.message.deleted",
  CHANNEL_CALL_VOICE='ws.channel.call.voice',
  CHANNEL_CALL_VIDEO='ws.channel.call.video',
  CHANNEL_MESSAGE_TYPING='ws.channel.message.typing',
}
