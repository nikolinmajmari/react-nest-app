import {Module} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {TypeOrmModule} from '@nestjs/typeorm';
import './polifylls/virtual.typeorm';
@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            useFactory: async (config: ConfigService) => {
                return {
                    keepAlive: true,
                    type: "postgres",
                    host: config.get<string>("DB_HOST"),
                    port: config.get<number>("DB_PORT"),
                    username: config.get<string>("DB_USERNAME"),
                    password: config.get<string>("DB_PASSWORD"),
                    database: config.get<string>("DB_DATABASE"),
                    migrationsRun: true,
                    synchronize: true,
                    autoLoadEntities: true,
                };
            },
            inject: [
                ConfigService
            ]
        })
    ],
})
export class TypeOrmCustomModule {
}
