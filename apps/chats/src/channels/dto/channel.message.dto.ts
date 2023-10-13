import { MessageType } from "@mdm/mdm-core";
import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsString, IsUUID } from "class-validator";
import User from "../../users/entities/user.entity";
import Channel from "../entities/channel.entity";


export class CreateMessageDTO{

    @ApiProperty()
    @IsEnum(MessageType)
    type: MessageType;

    
    @IsString()
    @ApiProperty()
    content: string;

    sender:User|string;

    @IsString()
    @IsOptional()
    media?:string;

    createdAt: Date;

    channel: Channel|string;
}

