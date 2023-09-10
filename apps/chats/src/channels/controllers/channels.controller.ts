import { Body, Controller, Get,Delete,Patch, HttpCode, HttpStatus, Param, Post, Req, UsePipes } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ChannelsService } from '../services/channels.service';
import { Public } from '../../auth/decorator';
import { CreateChannelDTO, UpdateChannelDTO } from '../dto/channel.dto.ts';
import { ChannelValidationPipe } from '../validation/channel.validation.pipe';

@Controller('channels')
@ApiTags("channels")
@ApiBearerAuth()
export class ChannelsController {

    constructor(
         private readonly service: ChannelsService
    ){}

    @Get("")
    @HttpCode(HttpStatus.OK)
    get(@Req() request){
        return this.service.findUserChannels(request.user);
    }


    @Post("")
    @HttpCode(HttpStatus.CREATED)
    @UsePipes(new ChannelValidationPipe())
    async create(
        @Body() dto:CreateChannelDTO,@Req() request
    ){
        return this.service.createChannelForUser(dto,request.user);
    }

    @Public()
    @HttpCode(HttpStatus.OK)
    @Get(":id")
    async getChannel(
        @Param("id") id :string
    ){
        return await this.service.findOneChannel(id);
    }


    @HttpCode(HttpStatus.OK)
    @Patch(":id")
    async patchChannel(
        @Param("id") id:string,
        @Body() dto:UpdateChannelDTO,
        @Req() request
    ){
        const channel = await this.service.findOneChannel(id);
        console.log(channel,request.user)
        return await this.service.updateChannel(channel,request.user,dto);
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(":id")
    async delete(@Param("id") id :string){
        await this.service.deleteChannel(id);
    }

}
