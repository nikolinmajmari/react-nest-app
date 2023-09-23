import { ApiPropertyOptional } from "@nestjs/swagger";
import { PaginitionDTO } from "../../core/paginition.dto";


export class ChannelMessagesQuery extends PaginitionDTO{

    @ApiPropertyOptional()
    search?:string;
    
}