import ws from 'ws';
import {IUser} from "@mdm/mdm-core";

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
