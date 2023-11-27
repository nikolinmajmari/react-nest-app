import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit, SubscribeMessage,
  WebSocketGateway,
  WebSocketServer, WsResponse
} from "@nestjs/websockets";
import {Server,WebSocket} from "ws";
import {Logger, UseFilters, UseGuards, UsePipes, ValidationPipe} from "@nestjs/common";
import {IncomingMessage} from "http";
import {WsAuthGuard} from "../auth/guard/ws-auth.guard";
import {MessagingService} from "./services/messaging.service";
import { WsCreateMessageDtoRequest} from "./dto/channel.message.dto";
import {BadRequestTransformationFilter} from "./filters/bad-request-transformation.filter";
import ChannelsRepository from "./repositories/channels.repository";
import {IWsResponse, WsEvents} from "../../../../libs/mdm-core/src/lib/ws";
import {EventEmitter2} from "@nestjs/event-emitter";
import {ChannelEvents, IChannelEvent} from "./channels.event";
import Message from "./entities/message.entity";

@WebSocketGateway(3001)
export default class ChannelsGateway implements  OnGatewayInit, OnGatewayConnection,OnGatewayDisconnect{

  private logger:Logger;
  constructor(
    private readonly messagingService : MessagingService,
    private readonly channelsRepository: ChannelsRepository,
    private readonly eventEmitter:EventEmitter2
  ) {
    this.logger = new Logger(ChannelsGateway.name);
  }

  @WebSocketServer()
  server:Server;


  afterInit(server: Server): any {
  }


  handleConnection(client: WebSocket, req:IncomingMessage): any {
    console.log('connected to client');
  }

  handleDisconnect(client: any): any {
  }


  @UseFilters(new BadRequestTransformationFilter())
  @UseGuards(WsAuthGuard)
  @SubscribeMessage(WsEvents.CHANNEL_MESSAGE_CREATE)
  async onMessageSent(
    @MessageBody(new ValidationPipe()) req : WsCreateMessageDtoRequest,
    @ConnectedSocket() client: WebSocket,
  ){
    const channel = await this.channelsRepository.findOneByOrFail({id:req.params.channel});
    const created = await this.messagingService.createMessage({
      user: client.handshake.user,
      channel,
      dto: req.data
    });
    const message = await this.messagingService.getMessage(created.id);
    client.sendJSON({
      id:req.id,
      result: message
    });
    this.logger.debug('emitting event ',+ChannelEvents.messageCreated);
    this.eventEmitter.emit(ChannelEvents.messageCreated,{
      channel: channel,
      data: message
    } as IChannelEvent<Message>)
  }


}
