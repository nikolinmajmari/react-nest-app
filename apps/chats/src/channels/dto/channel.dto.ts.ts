import { ArrayMinSize, IsArray, IsEnum, IsOptional, IsString, IsUUID, IsUrl, Length, ValidateNested } from "class-validator";
import User from "../../users/entities/user.entity";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ChannelType, MemberRole } from "@mdm/mdm-core";


export class CreateChannelmemberDTO{

    @IsUUID()
    @IsOptional()
    id?:string;

    @ApiProperty()
    @IsEnum(MemberRole)
    role:MemberRole;
 
    @ApiProperty({type:"string"})
    @IsUUID()
    @IsOptional()
    user:User|string;
}

export class CreateChannelDTO{

    @ApiProperty()
    @IsString({always:false})
    alias?:string;

    @ApiProperty()
    @IsEnum(ChannelType)
    type:ChannelType;

    @ApiProperty()
    @IsUrl()
    avatar?:string;

    @ApiProperty({
        type:CreateChannelmemberDTO,
        isArray: true
    })
    @IsArray({
        always: false,
    })
    @ArrayMinSize(1)
    @ValidateNested({each:true})
    @Type(()=>CreateChannelmemberDTO)
    members:CreateChannelmemberDTO[]
}



export class UpdateChannelDTO{

    @ApiProperty()
    @IsString({always:false})
    @IsOptional()
    alias?:string;


    @ApiProperty()
    @IsUrl()
    @IsOptional()
    avatar?:string;

    @ApiProperty({
        type:CreateChannelmemberDTO,
        isArray: true
    })
    @IsArray({
        always: false,
    })
    @ArrayMinSize(1)
    @ValidateNested({each:true})
    @Type(()=>CreateChannelmemberDTO)
    @IsOptional()
    members:CreateChannelmemberDTO[]

}