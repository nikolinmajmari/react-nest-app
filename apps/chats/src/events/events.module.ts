import { Module } from '@nestjs/common';
import EventsGateway from "./events.gateway";
import EventsWsService from "./pool.service";
import {AuthModule} from "../auth/auth.module";
import WsPoolService from "./pool.service";

@Module({
  providers:[
    EventsGateway,
    EventsWsService,
    WsPoolService,
  ],
  exports:[
    WsPoolService
  ],
  imports:[
    AuthModule
  ]
})
export class EventsModule {}
