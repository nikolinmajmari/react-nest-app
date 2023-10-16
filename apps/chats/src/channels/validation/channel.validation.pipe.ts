import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { ChannelCreateDTO } from "../dto/channel.dto.ts";
import { ChannelType } from "@mdm/mdm-core";




@Injectable()

export class ChannelValidationPipe implements PipeTransform<ChannelCreateDTO,ChannelCreateDTO>{
    transform(value: ChannelCreateDTO) {
        if(value.type===ChannelType.private && value.members.length!=1){
            throw new BadRequestException("You can add only one user in a private channel");
        }
        return  value;
    }
}