import {ArrayMinSize, IsArray, IsEnum, IsOptional, IsString, IsUrl, IsUUID, ValidateNested} from "class-validator";
import {ApiProperty, PartialType} from "@nestjs/swagger";
import {Type} from "class-transformer";
import {
    ChannelType,
    DeepPartialArrayResolve, DeepPartialResolve,
    IChannelMemberCreate,
    IChannelMemberEntity, IPartialChannel,
    MemberRole
} from "@mdm/mdm-core";


export class ChannelMemberCreateDTO implements Partial<IChannelMemberCreate> {

    @ApiProperty()
    @IsEnum(MemberRole)
    role: MemberRole;

    @ApiProperty({type: "string"})
    @IsUUID()
    @IsOptional()
    user: string;
  }


export class ChannelCreateDTO{

    @ApiProperty()
    @IsString({always: false})
    @IsOptional()
    alias?: string;

    @ApiProperty()
    @IsEnum(ChannelType)
    type: ChannelType;

    @ApiProperty()
    @IsUrl()
    @IsOptional()
    avatar?: string;

    @ApiProperty({
        type: ChannelMemberCreateDTO,
        isArray: true
    })
    @IsArray({
        always: false,
    })
    @ArrayMinSize(1)
    @ValidateNested({each: true})
    @Type(() => ChannelMemberCreateDTO)
    members: ChannelMemberCreateDTO[]
}


export class ChannelUpdateDTO extends PartialType(ChannelCreateDTO) {
    @IsUUID()
    @IsString()
    id: string;
}
