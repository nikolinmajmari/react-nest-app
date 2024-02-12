import {Module} from '@nestjs/common';

import {AppController} from './app.controller';
import {AppService} from './app.service';
import {CommonModule} from '../common/common.module';
import {TypeOrmCustomModule} from '../common/typeorm.module';
import {AuthModule} from '../auth/auth.module';
import {UsersModule} from '../users/users.module';
import {ChannelsModule} from '../channels/channels.module';
import {MediaModule} from '../media/media.module';
import {AuthorizationModule} from "../authorization/authorization.module";
import {EventsModule} from "../events/events.module";
import {EntityNotFoundExceptionFilter} from "./filters/EntityNotFoundExceptionFilter";

@Module({
    imports: [
      CommonModule,
      TypeOrmCustomModule,
      MediaModule,
      AuthModule,
      AuthorizationModule,
      UsersModule,
      ChannelsModule,
      EventsModule
    ],
    controllers: [AppController],
    providers: [AppService,EntityNotFoundExceptionFilter],
})
export class AppModule {
}
