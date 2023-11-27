import {Module} from '@nestjs/common';
import {AuthController} from './auth.controller';
import {UsersModule} from '../users/users.module';
import {AuthService} from './auth.service';
import {JwtModule} from '@nestjs/jwt';
import {LocalStrategy} from './strategies/local.strategy';
import {APP_GUARD} from '@nestjs/core';
import {JwtAuthGuard} from './guard/jwt-auth.guard';
import {JwtStrategy} from './strategies/jwt.strategy';
import {PassportModule} from '@nestjs/passport';
import {RefreshStrategy} from './strategies/refresh.strategy';
import {WsJwtStrategy} from "./strategies/ws-jwt.strategy";
import {WsJwtAuthGuard} from "./guard/ws-jwt-auth.guard";
import {WsAuthGuard} from "./guard/ws-auth.guard";

@Module({
    imports: [
        UsersModule,
        PassportModule,
        JwtModule.register({
            global: true,
        })
    ],
    providers: [
        AuthService,
        WsAuthGuard,
        LocalStrategy,
        JwtStrategy,
        WsJwtStrategy,
        WsJwtAuthGuard,
        RefreshStrategy,
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard
        }
    ],
    controllers: [AuthController],
    exports: [AuthService]
})
export class AuthModule {
}
