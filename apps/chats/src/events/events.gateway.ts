import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection, OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway, WebSocketServer
} from "@nestjs/websockets";
import {Server,WebSocket} from "ws";
@WebSocketGateway(80,{namespace:'events',transports:['websocket']})
export default class EventsGateway implements OnGatewayInit,OnGatewayConnection,OnGatewayDisconnect{
  handleDisconnect(client: WebSocket) {

  }

  @WebSocketServer()
  server:Server;

  handleConnection(client: WebSocket, ...args: any[]) {

  }
  afterInit(server: Server) {
      this.server = server;
  }

  @SubscribeMessage(`events`)
  handleEvent(
    @MessageBody() data:string,
  ):string{
    return data;
  }
}
