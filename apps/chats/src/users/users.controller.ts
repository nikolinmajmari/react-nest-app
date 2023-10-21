import {Body, ConflictException, Controller, Get, HttpCode, HttpStatus, Post, Query, Req} from '@nestjs/common';
import {UsersService} from './users.service';
import {CreateUserDTO} from './dto/user.dto';
import {Public} from '../auth/decorator';
import {ApiBearerAuth, ApiTags} from '@nestjs/swagger';
import {FindUserDTO} from './dto/findUser.dto';

@ApiBearerAuth()
@Controller('users')
@ApiTags("users")
export class UsersController {

    constructor(
        private readonly service: UsersService
    ) {
    }


    @HttpCode(HttpStatus.OK)
    @Get("")
    @Public()
    async get(
        @Query() dto: FindUserDTO,
        @Req() request,
    ) {
        console.log('finding', dto);
        return this.service.get({
            ...dto,
            limit: dto.limit ? parseInt(dto.limit.toString()) : 10,
            offset: dto.offset ? parseInt(dto.offset.toString()) : 0,
            user: request.user
        });
    }

    @HttpCode(HttpStatus.CREATED)
    @Post("")
    @Public()
    async create(@Body() dto: CreateUserDTO) {
        if (await this.service.findUserByIdentifier(dto.email)) {
            throw new ConflictException();
        }
        const user = await this.service.create(dto);
        return user.id;
    }
}
