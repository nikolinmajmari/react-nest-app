import ws from 'ws';
import {IPartialUser, IUser} from "@mdm/mdm-core";

interface IHandShake{
  user?:IUser;
  token?:string;
}

declare module 'ws' {
  export interface WebSocket extends ws {
    id?: string;
    handshake?:IHandShake;
    sendJSON(json:any):void;
  }
}

declare module 'express' {
  export interface Request{
    user: IUser
  }
}
