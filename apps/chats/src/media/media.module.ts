import {Module} from '@nestjs/common';
import {MediaController} from './media.controller';
import {MulterModule} from '@nestjs/platform-express';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {IEnvironment} from '../common/configurations.module';
import {MediaService} from './services/media.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import Media from './media.entity';
import {MediaThumbnailService} from "./services/media-thumbail.service";

@Module({
    controllers: [MediaController],
    imports: [
        MulterModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService<IEnvironment>) => ({
                dest: configService.get<string>('APP_MEDIA_PATH'),
            }),
            inject: [ConfigService]
        }),
        TypeOrmModule.forFeature([
            Media
        ]),
    ],
    providers: [MediaService,MediaThumbnailService],
  exports: [MediaService]
})
export class MediaModule {
}
