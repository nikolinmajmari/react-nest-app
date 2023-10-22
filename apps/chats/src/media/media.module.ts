import {Module} from '@nestjs/common';
import {MediaController} from './media.controller';
import {MulterModule} from '@nestjs/platform-express';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {IEnvironment} from '../common/configurations.module';
import {MediaService} from './media.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import Media from './media.entity';

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
    providers: [MediaService]
})
export class MediaModule {
}
