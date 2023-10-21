import {Injectable} from "@nestjs/common";
import {PassportStrategy} from "@nestjs/passport";
import {ExtractJwt, Strategy} from 'passport-jwt';
import {UsersService} from "../../users/users.service";
import {jwtConstants} from "../constants";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(private usersService: UsersService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: true,
            secretOrKey: jwtConstants.accessTokenSecret
        })
    }


    async validate(payload) {
        const user = await this.usersService.findUserProfileInfoByIdentifier(payload.email);
        return {id: payload.sub, email: payload.email, ...user}
    }
}
