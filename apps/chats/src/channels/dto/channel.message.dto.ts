import {ApiProperty} from "@nestjs/swagger";
import {ArrayMinSize, IsArray, IsOptional, IsString, ValidateNested} from "class-validator";
import {Type} from "class-transformer";
import {ChannelMemberCreateDTO} from "./channel.dto.ts";


export class CreateMessageDTO {
    @IsString()
    @ApiProperty()
    content: string;

    @IsString()
    @IsOptional()
    media?: string;
}


export class BulkDeleteMessagesDTO{
  @ApiProperty({
    type: String,
    isArray: true
  })
  @IsArray({
    always: false,
  })
  @ArrayMinSize(1)
  @IsString({
    each:true
  })
  messagesId:string[];
}
