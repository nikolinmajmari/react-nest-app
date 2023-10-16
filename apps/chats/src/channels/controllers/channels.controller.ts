import { Body, Controller, Get,Delete,Patch, HttpCode, HttpStatus, Param, Post, Req, UsePipes } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ChannelsService } from '../services/channels.service';
import { Logger } from '@nestjs/common';
import { ChannelCreateDTO, ChannelUpdateDTO } from '../dto/channel.dto.ts';
import { ChannelValidationPipe } from '../validation/channel.validation.pipe';
import { MessagingService } from '../services/messaging.service';
import { CreateMessageDTO } from '../dto/channel.message.dto';
import { ChannelType, IResolveChannel } from '@mdm/mdm-core';
import User from '../../users/entities/user.entity';
import ChannelMember from '../entities/channel-member.entity';

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
        @Body() dto:ChannelCreateDTO,@Req() request
    ){
        return this.service.createChannelForUser(dto,request.user);
    }

    @HttpCode(HttpStatus.OK)
    @Get(":id")
    async getChannel(
        @Req() request,
        @Param("id") id :string
    ){
        const channel =  await this.service.findOneChannel(id);
        console.log(channel.members);
        if(channel.type===ChannelType.group || !request.user){
            return channel;
        }
        let other:User|undefined;
        (await channel.members).forEach(async function(m:ChannelMember){
            if(((await m).user as User).id!==request.user.id){
                other = (await m.user) as User;
            }
        })
        if(!other){
            return channel;
        }
        channel.alias = `${other.firstName} ${other.lastName}`;;
        return channel as unknown as IResolveChannel;
    }


    @HttpCode(HttpStatus.OK)
    @Patch(":id")
    async patchChannel(
        @Param("id") id:string,
        @Body() dto:ChannelUpdateDTO,
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
