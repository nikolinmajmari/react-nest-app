import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer
} from "@nestjs/websockets";
import {Server, WebSocket} from "ws";
import {Logger, UseFilters, UseGuards, ValidationPipe} from "@nestjs/common";
import {IncomingMessage} from "http";
import {WsAuthGuard} from "../auth/guard/ws-auth.guard";
import {MessagingService} from "./services/messaging.service";
import {WsCreateMessageDtoRequest} from "./dto/channel.message.dto";
import {BadRequestTransformationFilter} from "./filters/bad-request-transformation.filter";
import ChannelsRepository from "./repositories/channels.repository";
import {WsEvents} from "../../../../libs/mdm-core/src/lib/ws";
import {EventEmitter2} from "@nestjs/event-emitter";
import {ChannelEvents, IChannelEvent} from "./channels.event";
import Message from "./entities/message.entity";

@WebSocketGateway(3001)
export default class ChannelsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

    @WebSocketServer()
    server: Server;
    private logger: Logger;

    constructor(
        private readonly messagingService: MessagingService,
        private readonly channelsRepository: ChannelsRepository,
        private readonly eventEmitter: EventEmitter2
    ) {
        this.logger = new Logger(ChannelsGateway.name);
    }

    afterInit(server: Server): any {
    }


    handleConnection(client: WebSocket, req: IncomingMessage): any {
        console.log('connected to client');
    }

    handleDisconnect(client: any): any {
    }


    @UseFilters(new BadRequestTransformationFilter())
    @UseGuards(WsAuthGuard)
    @SubscribeMessage(WsEvents.CHANNEL_MESSAGE_CREATE)
    async onMessageSent(
        @MessageBody(new ValidationPipe()) req: WsCreateMessageDtoRequest,
        @ConnectedSocket() client: WebSocket,
    ) {
        const channel = await this.channelsRepository.findOneByOrFail({id: req.params.channel});
        const {id} = await this.messagingService.createChannelMessage(
            channel,
            {...req.data, sender: client.handshake.user}
        );
        const message = await this.messagingService.getMessage(id);
        client.sendJSON({id: req.id, result: message});
        this.eventEmitter.emit(ChannelEvents.messageCreated, {
            channel: channel,
            data: message
        } as IChannelEvent<Message>)
    }

    @UseGuards(WsAuthGuard)
    @SubscribeMessage(WsEvents.CHANNEL_MESSAGE_TYPING)
    async onChannelMessageTyping(
        _, @ConnectedSocket() client: WebSocket
    ) {
        this.eventEmitter.emit(ChannelEvents.messageTyping);
    }

    @UseGuards(WsAuthGuard)
    @SubscribeMessage(WsEvents.CHANNEL_MESSAGE_TYPING)
    async onChannelConnected(
        _, @ConnectedSocket() client: WebSocket
    ) {
        this.eventEmitter.emit(ChannelEvents.inChat);
    }

}
