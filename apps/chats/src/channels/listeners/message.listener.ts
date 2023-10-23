import {Injectable} from "@nestjs/common";
import {OnEvent} from "@nestjs/event-emitter";
import {MessageEvent} from "../events/message.event";


@Injectable()
export class MessageListener{

  @OnEvent(MessageEvent.NAME)
  handleNewMessageEvent(){
    //// the event is sent therefore create new message

  }
}
