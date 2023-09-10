import { Module } from '@nestjs/common';
import { ChannelsController } from './controllers/channels.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from '../users/entities/user.entity';
import ChannelMemberEntity from './entities/channel-member.entity';
import MessageEntity from './entities/message.entity';
import { AuthModule } from '../auth/auth.module';
import { ChannelsService } from './services/channels.service';
import Channel from './entities/channel.entity';
import { ChannelValidationPipe } from './validation/channel.validation.pipe';
import { MembersService } from './services/members.service';
import { MembersController } from './controllers/members.controller';

@Module({
  imports:[
    TypeOrmModule.forFeature([
      Channel,ChannelMemberEntity,MessageEntity
    ]),
    AuthModule
  ],
  controllers: [ChannelsController,MembersController],
  providers: [
    ChannelsService,
    ChannelValidationPipe,
    MembersService,
  ],
  exports:[
    ChannelsService,
    MembersService
  ]
})
export class ChannelsModule {}
