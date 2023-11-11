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


@Module({
    imports: [
        TypeOrmModule.forFeature([
            Channel, ChannelMemberEntity, MessageEntity,Media
        ]),
        AuthModule,
        AuthorizationModule,
        MediaModule
    ],
    controllers: [ChannelsController],
    providers: [
        ChannelsService,
        ChannelValidationPipe,
        ParameterResolverPipe,
        MembersService,
        MessagingService,
        ChannelsRepository
    ],
    exports: [
        ChannelsService,
        MembersService
    ]
})
export class ChannelsModule {
}
