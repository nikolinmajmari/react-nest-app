import {Module} from '@nestjs/common';
import {ChannelsController} from './controllers/channels.controller';
import {TypeOrmModule} from '@nestjs/typeorm';
import ChannelMemberEntity from './entities/channel-member.entity';
import MessageEntity from './entities/message.entity';
import {AuthModule} from '../auth/auth.module';
import {ChannelsService} from './services/channels.service';
import Channel from './entities/channel.entity';
import {ChannelValidationPipe} from './pipes/channel.validation.pipe';
import {MembersService} from './services/members.service';
import {MessagingService} from './services/messaging.service';
import {AuthorizationModule} from "../authorization/authorization.module";
import Media from "../media/media.entity";
import {MediaModule} from "../media/media.module";
import ChannelsRepository from "./repositories/channels.repository";
import {ParameterResolverPipe} from "./pipes/parameter.resolver.pipe";
import {MembersController} from "./controllers/members.controller";
import ChannelsGateway from "./channels.gateway";
import {CommonModule} from "../common/common.module";
import {ChannelsListener} from "./channels.listener";
import {EventsModule} from "../events/events.module";
import MessageRecipient from "./entities/message-recipient.entity";
import MessagesRepository from "./repositories/messages.repository";


@Module({
    imports: [
        TypeOrmModule.forFeature([
            Channel, ChannelMemberEntity, MessageEntity,Media,
           MessageRecipient
        ]),
        AuthModule,
        EventsModule,
        CommonModule,
        AuthorizationModule,
        MediaModule
    ],
    controllers: [ChannelsController,MembersController],
    providers: [
        ChannelsService,
        ChannelValidationPipe,
        ParameterResolverPipe,
        MembersService,
        MessagingService,
        ChannelsGateway,
        ChannelsListener,
        ChannelsRepository,
        MessagesRepository,
    ],
    exports: [
        ChannelsService,
        MembersService
    ]
})
export class ChannelsModule {
}
