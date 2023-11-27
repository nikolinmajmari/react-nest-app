import {Injectable} from "@nestjs/common";
import {UsersService} from "../users/users.service";
import {JwtService} from '@nestjs/jwt';
import User from "../users/entities/user.entity";
import {jwtConstants} from "./constants";

@Injectable()
export class AuthService {

    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) {
    }


    // async signIn(email:string,pass:string):Promise<any>{
    //     const user = await this.usersService.findUserByIdentifier(email);
    //     if(user && user.password===pass){
    //         // eslint-disable-next-line @typescript-eslint/no-unused-vars
    //         const payload  = {
    //             sub: user.id,
    //             email: user.email,
    //         }
    //         return {
    //             access_token: await this.jwtService.signAsync(payload)
    //         };
    //     }
    //     throw new UnauthorizedException();
    // }


    async issueTokens(user: any) {
        const {refreshToken, ...rest} = user;
        const [access, refresh] = await this.getTokens(user, refreshToken);
        return {
            accessToken: access,
            refreshToken: refresh,
            user: {...rest}
        }
    }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findUserByIdentifier(email);
        if (user && user.password === pass) {
            const {password, ...result} = user;
            return result;
        }
        return;
    }

    async getTokens(user: Partial<User>, refresh: string | undefined) {
        const payload = {
            sub: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
        }
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: jwtConstants.accessTokenSecret,
                expiresIn: "30m"
            }),
            refresh ?
                refresh
                :
                this.jwtService.signAsync(payload, {
                    secret: jwtConstants.refreshTokenSecret,
                    expiresIn: "30m"
                }),
        ]);
        return [
            accessToken, refreshToken
        ]
    }

    async verifyToken(token:string){
      return await this.jwtService.verifyAsync(
        token,
        {
          secret: jwtConstants.accessTokenSecret,
          ignoreExpiration: true
        }
      );
    }

    async getUserProfile(email:string){
      return this.usersService.findUserProfileInfoByIdentifier(email);
    }

}
