import {Injectable} from "@nestjs/common";
import {v4 as uuid } from 'uuid';
import {IPartialUser, IUser} from "@mdm/mdm-core";
import {WebSocket} from 'ws';
import {EventEmitter2} from "@nestjs/event-emitter";

@Injectable()
export default class WsPoolService{

  private clients = new Map<string,WebSocket>();

  constructor() {
  }

  add(socket:WebSocket):string{
    console.log('adding',socket.handshake);
    socket.id = uuid();
    this.clients.set(socket.id,socket);
    return socket.id;
  }

  getUserConnections(user:IPartialUser){
    return Array.from(this.clients.values()).filter(
      client=>client.handshake.user.id===user.id && client.readyState === client.OPEN
    );
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
      this.clients.set(id,null);
    }
  }
}
