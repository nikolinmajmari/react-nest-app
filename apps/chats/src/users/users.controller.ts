import { Body, ConflictException, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDTO } from './dto/user.dto';

@Controller('users')
export class UsersController {

    constructor(
        private readonly service:UsersService
    ){}


    @HttpCode(HttpStatus.OK)
    @Get("")
    async get(){
       return this.service.get();
    }

    @HttpCode(HttpStatus.CREATED)
    @Post("")
    async create(@Body() dto:CreateUserDTO){
        if(await this.service.findUserByIdentifier(dto.email)){
            throw new ConflictException();
        }
        const user = await this.service.create(dto);
        return user.id;
    }
}
