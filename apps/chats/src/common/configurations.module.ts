import {Module} from "@nestjs/common";
import {ConfigModule} from '@nestjs/config';
import * as Joi from 'joi';

@Module({
    imports: [
        ConfigModule.forRoot({
            validationSchema: Joi.object({
              APP_ENV:Joi.string(),
                PORT: Joi.number(),
                DB_HOST: Joi.string(),
                DB_PORT: Joi.string(),
                DB_USERNAME: Joi.string(),
                DB_PASSWORD: Joi.string(),
                DB_DATABASE: Joi.string(),
                APP_NAME: Joi.string(),
                APP_MEDIA_PATH: Joi.string()
            }),
            envFilePath: [
                ".env.test", ".env.local", ".env.example", '.env', '.env.development', '.env.staging', '.env.production'
            ],
            isGlobal: true,
        }),
    ]
})

export class ConfigurationModule {
}

export interface IEnvironment {
    APP_ENV:string;
    PORT: number,
    DB_HOST: string,
    DB_PORT: string,
    DB_USERNAME: string,
    DB_PASSWORD: string,
    DB_DATABASE: string,
    APP_NAME: string,
    APP_MEDIA_PATH: string;
    APP_MEDIA_THUMBNAIL_PATH:string;
}
