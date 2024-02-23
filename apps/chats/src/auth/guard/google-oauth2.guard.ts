import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from "@nestjs/common";
import {AuthGuard} from "@nestjs/passport";
import {Observable} from "rxjs";
import {OAuth2Client} from "google-auth-library";
import {UsersService} from "../../users/users.service";
import {CreateUserDTO} from "../../users/dto/user.dto";


@Injectable()
export class GoogleOauth2Guard implements CanActivate{

  private client:OAuth2Client;

  constructor(
    private readonly usersService: UsersService
  ) {
    this.client = new OAuth2Client();
  }

  async canActivate(context: ExecutionContext)  {
    const req = context.switchToHttp().getRequest();
    const ticket = await this.client.verifyIdToken({
      idToken: req.headers['google-oauth-id-token'],
      audience: '621562990315-8eiq3p7i1l3962ni1cdgvr6d1d563qke.apps.googleusercontent.com'
    })
    const payload = ticket.getPayload();
    const {email,name,picture} = payload;
    let user = await this.usersService.findUserByIdentifier(email);
    if(!user){
      const [last,...first] = name.split(' ').reverse();
      const userDto:CreateUserDTO = {
        firstName: first.join(' '),
        lastName: last,
        email: email,
        avatar: picture,
        password: null,
      }
      user = await this.usersService.create(userDto);
    }
    req['user'] = user;
    return true;
  }

  handleRequest<IUser=any>(err:any,user:any,info:any,context:ExecutionContext){
    console.log(info,user);
    if(err||!user){
      throw err || new UnauthorizedException();
    }
    return user;
  }

}
