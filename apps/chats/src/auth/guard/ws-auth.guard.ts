import {CanActivate, ExecutionContext, Injectable} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import {Reflector} from "@nestjs/core";
import {Observable} from "rxjs";
import {WsException} from "@nestjs/websockets";
import {AuthService} from "../auth.service";
import {UsersService} from "../../users/users.service";

@Injectable()
export class WsAuthGuard implements CanActivate{
  constructor(
    private auth: AuthService
  ) {
  }

  async canActivate(context: ExecutionContext):  Promise<boolean> {
    const socket = context.switchToWs().getClient();
    const {token} = socket.handshake;
    try{
      const payload = await  this.auth.verifyToken(token);
      socket.handshake.user = await  this.auth.getUserProfile(payload.email);
      console.log('successfull auth');
    }catch (err){
      console.log(err);
      throw new WsException(err);
    }
    return true;
  }
}
