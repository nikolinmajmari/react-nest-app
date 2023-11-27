import {Injectable, Logger} from "@nestjs/common";
import {OnEvent} from "@nestjs/event-emitter";
import {IWsEvent, WsEvents} from "../../../../libs/mdm-core/src/lib/ws";
import Message from "./entities/message.entity";
import {ChannelEvents, IChannelEvent} from "./channels.event";
import WsPoolService from "../events/pool.service";
import ChannelsRepository from "./repositories/channels.repository";
import {messages} from "nx/src/utils/ab-testing";
import {IUser} from "@mdm/mdm-core";
import {WebSocket} from "ws";


@Injectable()
export class ChannelsListener {

  private logger:Logger;
  constructor(
    private readonly pool:WsPoolService,
    private readonly channelsRepository: ChannelsRepository
  ) {
    this.logger = new Logger(ChannelsListener.name);
  }

  @OnEvent(ChannelEvents.messageCreated)
  async onMessageCreated(e:IChannelEvent<Message>){
    //// the event is sent therefore create new message
    this.logger.debug(`Event ${ChannelEvents.messageCreated} dispatched`);
    const users = await this.channelsRepository.findChannelUsers(e.channel!);
    this.pool.bulkNotifyUsers(users,(ws)=>{
      console.log(ws.sendJSON);
      ws.sendJSON({
        event: WsEvents.CHANNEL_MESSAGE_CREATED,
        data: e.data,
        params: {channel:e.channel.id}
      } as IWsEvent<Message>)
    });
  }

  @OnEvent(ChannelEvents.inChat)
  onInChat(){
  }

  @OnEvent(ChannelEvents.leaveChat)
  onChatLeave(){
    //// the event is sent therefore create new message

  }
}
