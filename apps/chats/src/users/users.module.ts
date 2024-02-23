import {Module} from '@nestjs/common';
import {UsersController} from './users.controller';
import {TypeOrmModule} from '@nestjs/typeorm';
import User from './entities/user.entity';
import {UsersService} from './users.service';
import ChannelMember from '../channels/entities/channel-member.entity';
import {Channel} from 'diagnostics_channel';
import {AuthService} from "../auth/auth.service";
import {AuthModule} from "../auth/auth.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([User, ChannelMember, Channel]),
    ],
    controllers: [UsersController],
    providers: [UsersService],
    exports: [UsersService]
})
export class UsersModule {
}
