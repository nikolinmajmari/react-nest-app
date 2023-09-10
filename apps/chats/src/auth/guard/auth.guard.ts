import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException
} from "@nestjs/common";

import { JwtService } from "@nestjs/jwt";
import { jwtConstants } from "../constants";
import {Request} from "express";
import { Observable } from "rxjs";
import { Reflector } from "@nestjs/core";
import { IS_PUBLIC_KEY } from "../decorator";



@Injectable()
export class AuthGuard implements CanActivate{
    constructor(
        private jwtService:JwtService,
        private reflector: Reflector
    ){}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        console.log('activating');
        const isPublic = this.reflector.getAllAndOverride<boolean>(
            IS_PUBLIC_KEY,[
                context.getHandler(),
                context.getClass()
            ]
        );
        
        if(isPublic){
            /// @Public() decorator was used in class or handler
            return true;
        }

        
        const request = context.switchToHttp().getRequest();
        const token = this.extractJwtFromHttpHeader(request);
        if(!token){
            throw new UnauthorizedException();
        }
        try{
            const payload = await this.jwtService.verifyAsync(
                token,
                {
                    secret: jwtConstants.accessTokenSecret
                }
            );

            request['user'] = payload;
        }catch{
            throw new UnauthorizedException();
        }
        return true;
    }

    private extractJwtFromHttpHeader(request:Request):string|undefined{
        const [type,token] = request.headers.authorization?.split(' ')??[];
        return type === 'Bearer' ? token : undefined;
    }
}