import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from '../common/common.module';
import { TypeOrmCustomModule } from '../common/typeorm.module';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { ChannelsModule } from '../channels/channels.module';
import { MediaModule } from '../media/media.module';

@Module({
  imports: [CommonModule,TypeOrmCustomModule,MediaModule,AuthModule,UsersModule,ChannelsModule,],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
