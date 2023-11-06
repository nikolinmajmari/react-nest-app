import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UsePipes
} from '@nestjs/common';
import {ApiBearerAuth, ApiTags} from '@nestjs/swagger';
import {ChannelsService} from '../services/channels.service';
import {ChannelCreateDTO, ChannelUpdateDTO} from '../dto/channel.dto';
import {ChannelValidationPipe} from '../validation/channel.validation.pipe';
import {MessagingService} from '../services/messaging.service';
import {BulkDeleteMessagesDTO, CreateMessageDTO} from '../dto/channel.message.dto';
import {Request} from "express";
import ChannelAuthorizer from "../../authorization/ChannelAuthorizer";
import {Action} from "../../authorization/authorizer.base.";
import {IUser, MediaType} from "@mdm/mdm-core";
import {MembersService} from "../services/members.service";
import {EntityNotFoundError} from "typeorm";
import ChannelMember from "../entities/channel-member.entity";

@Controller('channels') @ApiTags("channels") @ApiBearerAuth()
export class ChannelsController {

  constructor(
    private readonly service: ChannelsService,
    private readonly authorization: ChannelAuthorizer,
    private readonly messagingService: MessagingService,
    private readonly membersService:MembersService,
  ) {
  }

  @Get("") @HttpCode(HttpStatus.OK) get(@Req() request: Request) {
    return this.service.findUserChannels(request.user);
  }


  @Post("") @HttpCode(HttpStatus.CREATED) @UsePipes(new ChannelValidationPipe())
  async create(@Body() dto: ChannelCreateDTO, @Req() request:Request) {
    const created = await this.service.createChannelForUser(dto, request.user);
    return await this.service.findUserChannel(created.id,request.user);
  }

  @HttpCode(HttpStatus.OK) @Get(":id")
  async getChannel(@Req() request: Request, @Param("id") id: string) {
    const user = request.user as IUser;
    const channel = await this.service.findOneOrFail(id);
    await this.authorization.denyAccessUnlessAuthorized(Action.View, channel, user);
    return this.service.findUserChannel(id, user);
  }

  @HttpCode(HttpStatus.OK) @Patch(":id")
  async patchChannel(@Param("id") id: string, @Body() dto: ChannelUpdateDTO, @Req() request: Request) {
    const user = request.user as IUser;
    const channel = await this.service.findOneOrFail(id);
    await this.authorization.denyAccessUnlessAuthorized(Action.Update, channel, user);
    return await this.service.updateChannel(channel, request.user, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT) @Delete(":id")
  async delete(@Param("id") id: string, @Req() request: Request) {
    const user = request.user as IUser;
    const channel = await this.service.findOneOrFail(id);
    await this.authorization.denyAccessUnlessAuthorized(Action.Update, channel, user);
    await this.service.deleteChannel(channel);
  }


  @HttpCode(HttpStatus.OK) @Get(":id/messages")
  async getMessages(
    @Param("id") id: string,
    @Req() req,
    @Query('skip') skip:number,
    @Query('take') take:number
    ) {
    const channel = await this.service.findOneOrFail(id);
    const messages =  await this.messagingService.getMessages(channel, {
      skip:skip??0,
      take:take??10,
    });
    return {
      data:messages,
      meta:{
        skip:skip??0,take:take??10
      }
    }
  }

  @HttpCode(HttpStatus.CREATED) @Post(":id/messages")
  async postMessage(@Param("id") id: string, @Body() dto: CreateMessageDTO, @Req() req) {
    const channel = await this.service.findOneOrFail(id);
    const message = await this.messagingService.createMessage({
      channel, user: req.user, dto
    });
    return message?.id;
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id/messages')
  async deleteMessages(
    @Param('id') id:string,
    @Body() body:BulkDeleteMessagesDTO,
  ){
    const channel = await this.service.findOneOrFail(id);
    return await this.messagingService.deleteMessages(body.messagesId,channel);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':channel/messages/:message')
  async deleteMessage(
    @Param("channel") channelId:string,
    @Param('message') messageId:string,
  ){
    const channel = await this.service.findOneOrFail(channelId);
    const message = await this.messagingService.findOrFail(messageId,channel);
    await this.messagingService.deleteMessage(message);
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id/media')
  async getChannelMedia(
      @Param('id') channelId:string,
      @Query('category') category:string,
  ){
    const channel = await this.service.findOneOrFail(channelId);
    return await this.service.findChannelMedia(channel,
        category=='docs'?
            [MediaType.file,MediaType.pdf]
            :
            [MediaType.image,MediaType.video]
        );
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id/members')
  async getChannelMembers(
    @Param('id') channelId:string,
  ){
    const channel = await this.service.findOneOrFail(channelId);
    return this.membersService.findChannelMembers(channel);
  }

  @HttpCode(HttpStatus.OK)
  @Delete(':channel/members/:id')
  async removeChannelMember(
    @Param('channel') channelId:string,
    @Param('id') memberId:string,
  ){
    const channel = await this.service.findOneOrFail(channelId);
    const member = await this.membersService.findChannelMember(memberId);
    if((await member.channel).id!==channel.id){
      throw new Error('could not find');
    }
    await this.membersService.removeMember(member);
  }
}
