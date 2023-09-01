import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateUserDTO{

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    firstName:string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    lastName:string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    email:string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    password:string;
    
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    avatar:string;
}