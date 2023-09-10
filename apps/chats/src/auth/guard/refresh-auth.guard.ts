import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AuthGuard } from "@nestjs/passport";



@Injectable()
export class RefreshTokenAuthGuard extends AuthGuard('refresh-jwt'){
    constructor(private jwtService:JwtService){
        super();
    }

     canActivate(context: ExecutionContext) {
        const req = context.switchToHttp().getRequest();
        console.log('called refresh guard',req.headers['authorization']);
        return super.canActivate(context);
    }

    handleRequest<TUser = any>(err: any, user: any, info: any, context: ExecutionContext, status?: any): TUser {
        console.log(err,user);
        if(err || !user){
            throw err || new UnauthorizedException();
        }
        return user;
    }

}