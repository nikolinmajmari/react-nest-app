import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { CreateChannelDTO } from "../dto/channel.dto.ts";




@Injectable()

export class ChannelValidationPipe implements PipeTransform<CreateChannelDTO,CreateChannelDTO>{
    transform(value: CreateChannelDTO) {
        if(value.type==="private" && value.members.length!=1){
            throw new BadRequestException("You can add only one user in a private channel");
        }
        return  value;
    }
}