import {Injectable} from "@nestjs/common";
import {PassportStrategy} from "@nestjs/passport";
import {ExtractJwt, Strategy} from "passport-jwt";
import {jwtConstants} from "../constants";
import {UsersService} from "../../users/users.service";

@Injectable()
export class WsJwtStrategy extends PassportStrategy(Strategy,'ws-jwt'){
  constructor(
    private readonly userService:UsersService
  ) {
    super({
      ///jwtFromRequest: ExtractJwt.fromUrlQueryParameter('bearerToken'),
      jwtFromRequest: (req)=>{
        console.log('express request',req);
        return '';
      },
      secretOrKey:  jwtConstants.accessTokenSecret
    });
  }

  async validate(payload: any){
    console.log('WsJwtStrategy:',payload);
    const user = await this.userService.findUserProfileInfoByIdentifier(payload.email);
    return {id: payload.sub, email: payload.email, ...user}
  }
}
