import { Body, Controller, Get,Delete,Patch, HttpCode, HttpStatus, Param, Post, Req, UsePipes } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ChannelsService } from '../services/channels.service';
import { Public } from '../../auth/decorator';
import { CreateChannelDTO, UpdateChannelDTO } from '../dto/channel.dto.ts';
import { ChannelValidationPipe } from '../validation/channel.validation.pipe';
import { MessagingService } from '../services/messaging.service';
import { CreateMessageDTO } from '../dto/channel.message.dto';

@Controller('channels')
@ApiTags("channels")
@ApiBearerAuth()
export class ChannelsController {

    constructor(
         private readonly service: ChannelsService,
         private readonly messagingService: MessagingService
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


    @HttpCode(HttpStatus.OK)
    @Get(":id/messages")
    async getMessages(
         @Param("id") id:string,
         @Req() req
    ){
        const channel = await this.service.findOneChannel(id);
        const messages = await this.messagingService.getMessages(
            channel,{}
        );
        return messages;
    }

    @HttpCode(HttpStatus.CREATED)
    @Post(":id/messages")
    async postMessage(
        @Param("id") id:string,
        @Body() dto:CreateMessageDTO,
        @Req() req
    ){
        const channel = await this.service.findOneChannel(id);
        const message = await this.messagingService.createMessage({
            channel,user: req.user,dto
        });
        return message?.id;
    }

}
