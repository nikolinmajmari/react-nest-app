import {Body, Delete, HttpCode, HttpStatus, Injectable, Param, Patch, Put, Req} from "@nestjs/common";
import {MembersService} from "../services/members.service";
import {UpdateChannelmemberDTO} from "../dto/channel.member.dto";


@Injectable()
export class MembersController{

  constructor(
    private readonly service:MembersService
  ) {
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async remove(
    @Param('id') memberId:string
  ){
    const member = await this.service.findMember(memberId);
    const channel = await member.channel;
    await this.service.removeMember(member);
  }


  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch(':id')
  async patch(
    @Param('id') memberId:string,
    @Body() dto:UpdateChannelmemberDTO,
    @Req() req
  ){
    const member = await this.service.findMember(memberId);
    const channel = await member.channel;
    return await this.service.updateChannelMember(member,dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Put(':id/role')
  async put(
    @Param('id') memberId:string,
    @Body() dto:Pick<UpdateChannelmemberDTO, 'role'>  ){
    const member = await this.service.findMember(memberId);
    const channel = await member.channel;
    return await this.service.updateChannelMember(member,dto);
  }


}
