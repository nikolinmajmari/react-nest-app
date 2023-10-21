import {ApiProperty} from "@nestjs/swagger";
import {IsOptional, IsString} from "class-validator";


export class CreateMessageDTO {
    @IsString()
    @ApiProperty()
    content: string;

    @IsString()
    @IsOptional()
    media?: string;
}

