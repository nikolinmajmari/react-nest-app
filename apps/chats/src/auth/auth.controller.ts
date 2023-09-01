import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signIn.dto';

@Controller('auth')
export class AuthController {

    constructor(private authService:AuthService){}


    @HttpCode(HttpStatus.OK)
    @Post("login")
    signIn(@Body() dto: SignInDto){
        return this.authService.signIn(dto.email,dto.password);
    }
}
