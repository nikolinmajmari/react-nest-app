import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from "../../users/users.service";
import { jwtConstants } from "../constants";



@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy,'refresh-jwt'){
    constructor(private usersService:UsersService){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: true,
            secretOrKey: jwtConstants.refreshTokenSecret,
            passReqToCallback:true
        })
    }


    async validate(req,payload){
        const refreshToken = req.headers['authorization'].replace('Bearer ','').trim();
        return {...payload,refreshToken};
    }
}