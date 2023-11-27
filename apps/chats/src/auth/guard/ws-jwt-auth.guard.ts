import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from "@nestjs/common";

import {JwtService} from "@nestjs/jwt";
import {jwtConstants} from "../constants";
import {Request} from "express";
import {Reflector} from "@nestjs/core";
import {IS_PUBLIC_KEY} from "../decorator";
import {AuthGuard} from "@nestjs/passport";
import {Observable} from "rxjs";
import {WsException} from "@nestjs/websockets";


@Injectable()
export class WsJwtAuthGuard extends AuthGuard('ws-jwt'){
  constructor(
    private reflector: Reflector
  ) {
    super();
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride(IS_PUBLIC_KEY,[
      context.getHandler(),
      context.getClass()
    ]);
    if(isPublic){
      return true;
    }
    console.log('request from ws-jwt',context.switchToWs().getData());
    return super.canActivate(context);
  }

  getRequest(context:ExecutionContext){
    console.log()
    return context.switchToWs().getClient().upgradedReq;
  }
}
