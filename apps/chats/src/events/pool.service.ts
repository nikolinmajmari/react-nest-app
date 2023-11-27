import {Injectable} from "@nestjs/common";
import {v4 as uuid } from 'uuid';
import {IPartialUser, IUser} from "@mdm/mdm-core";
import {WebSocket} from 'ws';
import {EventEmitter2} from "@nestjs/event-emitter";

@Injectable()
export default class WsPoolService{

  private clients = new Map<string,WebSocket>();

  constructor(
    private emitter:EventEmitter2
  ) {
  }

  add(socket:WebSocket):string{
    socket.id = uuid();
    this.clients.set(socket.id,socket);
    return socket.id;
  }

  getUserConnections(user:IPartialUser){
    return Array.from(this.clients.values()).filter(v=>v.handshake.user.id===user.id);
  }

  bulkNotifyUsers(users:IUser[],handler:(conn:WebSocket)=>Promise<void>|void){
    users.forEach( (user)=>{
      const connections = this.getUserConnections(user);
      connections.forEach(function (conn){
        handler(conn);
      });
    });
  }

  remove(id:string){
    const client = this.clients.get(id);
    if(client){
      client.close();
      this.clients.set(id,null);
    }
  }

  count(){
    return this.clients.size;
  }
}
