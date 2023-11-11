import { Module } from '@nestjs/common';
import {RolesGuard} from "./guard/roles.guard";
import {TypeOrmCustomModule} from "../common/typeorm.module";
import {TypeOrmModule} from "@nestjs/typeorm";
import Channel from "../channels/entities/channel.entity";
import ChannelMember from "../channels/entities/channel-member.entity";
import Message from "../channels/entities/message.entity";
import Media from "../media/media.entity";
import ChannelsAuthorizer from "../channels/channels.authorizer";

@Module({
  imports:[
    TypeOrmModule.forFeature([
      Channel,ChannelMember,Message,Media
    ])
  ],
  providers:[
    RolesGuard,ChannelsAuthorizer
  ],
  exports:[
    RolesGuard,ChannelsAuthorizer
  ]
})


export class AuthorizationModule {}
