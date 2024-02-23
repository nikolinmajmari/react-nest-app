import {Injectable, Logger} from "@nestjs/common";
import {OnEvent} from "@nestjs/event-emitter";
import {IWsEvent, WsEvents} from "../../../../libs/mdm-core/src/lib/ws";
import Message from "./entities/message.entity";
import {ChannelEvents, IChannelEvent, IMessagesDeletedEvent, IUserEvent} from "./channels.event";
import WsPoolService from "../events/pool.service";
import ChannelsRepository from "./repositories/channels.repository";

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
      ws.sendJSON({
        event: WsEvents.CHANNEL_MESSAGE_CREATED,
        data: e.data,
        params: {channel:e.channel.id}
      } as IWsEvent<Message>)
    });
  }

  @OnEvent(ChannelEvents.inChat)
  async onInChat(e:IChannelEvent<IUserEvent>){
    this.logger.debug(`Event ${ChannelEvents.inChat}} dispatched`);
    const users = await this.channelsRepository.findChannelUsers(e.channel!);
    this.pool.bulkNotifyUsers(users,(ws)=>{
      ws.sendJSON({
        event: WsEvents.CHANNEL_IN_CHAT,
        data: e.data,
        params: {channel: e.channel.id}
      })
    })
  }


  @OnEvent(ChannelEvents.messageTyping)
  async onMessageTyping(e:IChannelEvent<IUserEvent>){
    this.logger.debug(`Event ${ChannelEvents.messageTyping}} dispatched`);
    const users = await this.channelsRepository.findChannelUsers(e.channel!);
    this.pool.bulkNotifyUsers(users,(ws)=>{
      ws.sendJSON({
        event: WsEvents.CHANNEL_MESSAGE_TYPING,
        data: e.data,
        params: {channel: e.channel.id}
      })
    })
  }

  @OnEvent(ChannelEvents.leaveChat)
  async onChatLeave(e:IChannelEvent<IUserEvent>){
    //// the event is sent therefore create new message
    this.logger.debug(`Event ${ChannelEvents.leaveChat}} dispatched`);
    const users = await this.channelsRepository.findChannelUsers(e.channel!);
    this.pool.bulkNotifyUsers(users,(ws)=>{
      ws.sendJSON({
        event: WsEvents.CHANNEL_LEAVE_CHAT,
        data: e.data,
        params: {channel: e.channel.id}
      })
    })
  }

  @OnEvent(ChannelEvents.messageDeleted)
  async onMessageDeleted(e:IChannelEvent<string[]>){
    //// the event is sent therefore create new message
    this.logger.debug(`Event ${ChannelEvents.leaveChat}} dispatched`);
    const users = await this.channelsRepository.findChannelUsers(e.channel!);
    this.pool.bulkNotifyUsers(users,(ws)=>{
      ws.sendJSON({
        event: WsEvents.CHANNEL_MESSAGE_DELETED,
        data: e.data,
        params: {channel: e.channel.id}
      })
    })
  }
}
