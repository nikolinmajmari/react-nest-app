import {
  OnGatewayConnection, OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway, WebSocketServer
} from "@nestjs/websockets";
import { Logger} from "@nestjs/common";
import {IncomingMessage} from "http";
import {WebSocket,Server} from "ws";
import '../types';
import WsPoolService from "./pool.service";
import * as modUrl from 'url';
import {AuthService} from "../auth/auth.service";


@WebSocketGateway(3001)
export default class EventsGateway implements OnGatewayInit,OnGatewayConnection,OnGatewayDisconnect{

  private logger:Logger;
  constructor(
    private readonly pool:WsPoolService,
    private readonly authService:AuthService
  ) {
    this.logger = new Logger(EventsGateway.name);
    WebSocket.prototype["sendJSON"] = function (json:any){
      this.send(JSON.stringify(json));
    }
  }

  handleDisconnect(client: WebSocket) {
    client.close();
    this.pool.remove(client.id);
  }

  @WebSocketServer()
  server:Server;

  async handleConnection(webSocket:WebSocket,req:IncomingMessage) {
    webSocket.handshake = {};
    const search = new URLSearchParams(
      modUrl.parse(req.url).search??''
    );
    const token = search.get('bearerToken');
    try{
      const payload = await this.authService.verifyToken(token);
      webSocket.handshake = {
        user: {
          id: payload.sub,
          email: payload.email,
          ...payload
        },
        token
      };
      this.pool.add(webSocket);
      this.logger.log(`initialized ws connection id: ${webSocket.id} for user ${webSocket.handshake.user.id}`);
    }catch (e){
      webSocket.close();
    }
  }

  afterInit(server: Server) {
      this.server = server;
  }
}
