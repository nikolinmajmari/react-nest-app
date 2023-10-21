import {ApiPropertyOptional} from "@nestjs/swagger";
import {IsOptional, IsString} from "class-validator";
import {PaginitionDTO} from "../../core/paginition.dto";

export class FindUserDTO extends PaginitionDTO {

    @ApiPropertyOptional()
    @IsOptional()
    privateChannelCandidate?: boolean;


    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    search?: string;
}
