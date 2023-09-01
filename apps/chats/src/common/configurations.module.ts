import { Module } from "@nestjs/common";
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

@Module({
    imports:[
        ConfigModule.forRoot({
            validationSchema:Joi.object({
                PORT:Joi.number(),
                DB_HOST:Joi.string(),
                DB_PORT:Joi.string(),
                DB_USERNAME:Joi.string(),
                DB_PASSWORD:Joi.string(),
                DB_DATABASE:Joi.string()
            }),
            envFilePath: [
                ".env.test",".env.local",".env.example",'.env', '.env.development', '.env.staging', '.env.production'
            ],
            isGlobal: true,
        }),
    ]
})
export class ConfigurationModule{}