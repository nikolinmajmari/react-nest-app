import {ApiPropertyOptional} from "@nestjs/swagger";
import {IsNumberString, IsOptional} from "class-validator";

export class PaginitionDTO {
    @ApiPropertyOptional({
        "name": "limit",
        type: Number,
        required: false,
    })
    @IsOptional()
    @IsNumberString()
    limit?: number;

    @ApiPropertyOptional({
        "name": "offset",
        type: Number,
        required: false,
    })
    @IsOptional()
    @IsNumberString()
    offset?: number;

}
