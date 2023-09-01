import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService{

    constructor(
        private usersService:UsersService,
        private jwtService: JwtService
        ){}


    async signIn(email:string,pass:string):Promise<any>{
        const user = await this.usersService.findUserByIdentifier(email);
        if(user && user.password===pass){
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const payload  = {
                sub: user.id,
                email: user.email,
            }
            return {
                access_token: await this.jwtService.signAsync(payload)
            };
        }
        throw new UnauthorizedException();
    }
}