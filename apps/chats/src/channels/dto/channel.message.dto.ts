import {ApiProperty} from "@nestjs/swagger";
import {ArrayMinSize, IsArray, IsNotEmpty, IsOptional, IsString, IsUUID, ValidateNested} from "class-validator";
import {IWsRequest} from "../../../../../libs/mdm-core/src/lib/ws";
import {Type} from "class-transformer";


export class CreateMessageDTO {
    @IsString()
    @ApiProperty()
    content: string;

    @IsString()
    @IsOptional()
    media?: string;
}

export class WsCreateMessageDtoParams{
  channel:string;
}
export class WsCreateMessageDtoRequest implements Omit<IWsRequest<CreateMessageDTO>, 'event'>
{
  @Type(()=>CreateMessageDTO)
  @ValidateNested()
  data: CreateMessageDTO;

  @IsString()
  id:string;

  @Type(()=>WsCreateMessageDtoParams)
  @ValidateNested()
  params:WsCreateMessageDtoParams;
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
