import {Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Request, UseGuards} from '@nestjs/common';
import {AuthService} from './auth.service';
import {SignInDto} from './dto/signIn.dto';
import {LocalAuthGuard} from './guard/local-auth.guard';
import {Public} from './decorator';
import {ApiBearerAuth, ApiBody, ApiHeaders, ApiTags} from '@nestjs/swagger';
import {RefreshTokenAuthGuard} from './guard/refresh-auth.guard';
import {GoogleOauth2Guard} from "./guard/google-oauth2.guard";

@Controller('auth')
@ApiTags('auth')
export class AuthController {

    constructor(private authService: AuthService) {
    }

    @Public()
    @UseGuards(LocalAuthGuard)
    @ApiBody({
        type: SignInDto,
        schema: {
            example: {
                "email": "nmajmari@gmail.com",
                "password": "Subset3036"
            }
        }
    })
    @HttpCode(HttpStatus.OK)
    @Post("login")
    signIn(@Request() req: Express.Request, @Body() dto: SignInDto) {
        return this.authService.issueTokens(req.user);
    }

  @Public()
  @UseGuards(GoogleOauth2Guard)
  @ApiHeaders([{
    name: 'GOOGLE-OAUTH-ID-TOKEN',
  }])
  @HttpCode(HttpStatus.OK)
  @Post("google")
  google(@Request() req: Express.Request) {
    return this.authService.issueTokens(req.user);
  }

    @ApiBearerAuth()
    @Public()
    @Post('refresh')
    @UseGuards(RefreshTokenAuthGuard)
    refresh(@Req() request) {
        return this.authService.issueTokens(request.user);
    }


    @ApiBearerAuth()
    @Get("profile")
    getProfile(@Request() request) {
        console.log(request.user);
        return request.user;
    }
}
