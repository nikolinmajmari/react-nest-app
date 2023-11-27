import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UsePipes
} from '@nestjs/common';
import {ApiBearerAuth, ApiTags} from '@nestjs/swagger';
import {ChannelsService} from '../services/channels.service';
import {ChannelCreateDTO, ChannelMemberCreateDTO, ChannelUpdateDTO} from '../dto/channel.dto';
import {ChannelValidationPipe} from '../pipes/channel.validation.pipe';
import {MessagingService} from '../services/messaging.service';
import {BulkDeleteMessagesDTO, CreateMessageDTO} from '../dto/channel.message.dto';
import {Request} from "express";
import ChannelsAuthorizer from "../channels.authorizer";
import {Action} from "../../authorization/authorizer.base.";
import {IUser, MediaType} from "@mdm/mdm-core";
import {MembersService} from "../services/members.service";
import ChannelsRepository from "../repositories/channels.repository";
import Channel from "../entities/channel.entity";
import {ParameterResolverPipe} from "../pipes/parameter.resolver.pipe";
import ChannelMember from "../entities/channel-member.entity";
import {EventEmitter2} from "@nestjs/event-emitter";
import {ChannelEvents, IChannelEvent} from "../channels.event";
import Message from "../entities/message.entity";

@Controller('channels')
@ApiTags("channels")
@ApiBearerAuth()
export class ChannelsController {

  constructor(
    private readonly repository: ChannelsRepository,
    private readonly service: ChannelsService,
    private readonly authorization: ChannelsAuthorizer,
    private readonly messagingService: MessagingService,
    private readonly membersService: MembersService,
    private readonly eventEmitter:EventEmitter2
  ) {}

  @Get("")
  @HttpCode(HttpStatus.OK)
  get(@Req() request: Request) {
    return this.repository.findUserChannels(request.user);
  }


  @Post("")
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ChannelValidationPipe())
  async create(
    @Body() dto: ChannelCreateDTO,
    @Req() request: Request
  ) {
    return await this.service.createChannelForUser(dto, request.user);
  }

  @HttpCode(HttpStatus.OK)
  @Get(":channel")
  async getChannel(
    @Req() request: Request,
    @Param("channel", ParameterResolverPipe) channel: Channel
  ) {
    const user = request.user as IUser;
    await this.authorization.authorize(Action.View, user, channel);
    return this.repository.findUserChannel(channel.id, user);
  }

  @HttpCode(HttpStatus.OK)
  @Patch(":channel")
  async patchChannel(
    @Param("channel", ParameterResolverPipe) channel: Channel,
    @Body() dto: ChannelUpdateDTO,
    @Req() request: Request
  ) {
    const user = request.user as IUser;
    await this.authorization.authorize(Action.Update, user, channel);
    return await this.service.updateChannel(channel, request.user, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(":channel")
  async delete(
    @Param("channel", ParameterResolverPipe) channel: Channel,
    @Req() request: Request
  ) {
    const user = request.user as IUser;
    await this.authorization.authorize(Action.Update, user, channel);
    await this.service.deleteChannel(channel);
  }


  @HttpCode(HttpStatus.OK)
  @Get(":channel/messages")
  async getMessages(
    @Param("channel", ParameterResolverPipe) channel: Channel,
    @Query('skip') skip: number,
    @Query('take') take: number
  ) {
    const messages = await this.messagingService.getMessages(channel, {
      skip: skip ?? 0, take: take ?? 10,
    });
    return {
      data: messages, meta: {
        skip: skip ?? 0, take: take ?? 10
      }
    }
  }

  @HttpCode(HttpStatus.CREATED)
  @Post(":channel/messages")
  async postMessage(
    @Param("channel", ParameterResolverPipe) channel: Channel,
    @Body() dto: CreateMessageDTO,
    @Req() req:Request
  ) {
    const message = await this.messagingService.createMessage({
      channel, user: req.user as IUser, dto
    });
    this.eventEmitter.emit(ChannelEvents.messageCreated,{
      channel: channel,
      data: await this.messagingService.getMessage(message.id),
    } as IChannelEvent<Message>)
    return message?.id;
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':channel/messages')
  async deleteMessages(
    @Param("channel", ParameterResolverPipe) channel: Channel,
    @Body() body: BulkDeleteMessagesDTO
  ) {
    return await this.messagingService.deleteMessages(body.messagesId, channel);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':channel/messages/:message')
  async deleteMessage(
    @Param("channel", ParameterResolverPipe) channel: Channel,
    @Param('message') messageId: string
  ) {
    const message = await this.messagingService.findOrFail(messageId, channel);
    await this.messagingService.deleteMessage(message);
  }

  @HttpCode(HttpStatus.OK)
  @Get(':channel/media')
  async getChannelMedia(
    @Param("channel", ParameterResolverPipe) channel: Channel,
    @Query('category') category: string
  ) {
    return await this.service.findChannelMedia(
      channel,
      category == 'docs' ?
        [MediaType.file, MediaType.pdf]
        :
        [MediaType.image, MediaType.video]
    );
  }

  @HttpCode(HttpStatus.OK) @Get(':channel/members')
  async getChannelMembers(
    @Param("channel", ParameterResolverPipe) channel: Channel
  ) {
    return this.membersService.findChannelMembers(channel);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post(':channel/members')
  async addChannelMember(
    @Body() dto: ChannelMemberCreateDTO,
    @Param("channel", ParameterResolverPipe) channel: Channel,
    @Req() req:Request
  ) {
    await this.authorization.authorize(Action.Update, req.user as IUser, channel);
    const member =  await this.membersService.addChannelMember(channel, dto);
    return this.membersService.findMember(member.id);
  }

  @HttpCode(HttpStatus.OK)
  @Delete(':channel/members/:member')
  async removeChannelMember(
    @Param("channel", ParameterResolverPipe) channel: Channel,
    @Param('member', ParameterResolverPipe) member: ChannelMember
  ) {
    if ((await member.channel).id !== channel.id) {
      throw new NotFoundException();
    }
    await this.membersService.removeMember(member);
  }
}
