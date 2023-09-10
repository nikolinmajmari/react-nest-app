import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import User from "../entities/user.entity";
import { IsBoolean } from "class-validator";
import { PaginitionDTO } from "../../core/paginition.dto";

export class FindUserDTO extends PaginitionDTO{

    @ApiPropertyOptional()
    privateChannelCandidate?:boolean;


    @ApiPropertyOptional()
    search?:string;
}