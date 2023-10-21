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
        LocalStrategy,
        JwtStrategy,
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
