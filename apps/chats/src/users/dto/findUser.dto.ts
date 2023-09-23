import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import User from "../entities/user.entity";
import { IsBoolean, IsOptional, IsString } from "class-validator";
import { PaginitionDTO } from "../../core/paginition.dto";

export class FindUserDTO extends PaginitionDTO{

    @ApiPropertyOptional()
    @IsOptional()
    privateChannelCandidate?:boolean;


    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    search?:string;
}