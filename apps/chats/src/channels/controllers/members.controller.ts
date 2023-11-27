import {Body, Controller, Delete, HttpCode, HttpStatus, Injectable, Param, Patch, Put, Req} from "@nestjs/common";
import {MembersService} from "../services/members.service";
import {UpdateChannelMemberDTO} from "../dto/channel.member.dto";


@Injectable()
@Controller('members')
export class MembersController{

  constructor(
    private readonly service:MembersService
  ) {}

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
    @Body() dto:UpdateChannelMemberDTO  ){
    const member = await this.service.findMember(memberId);
    return await this.service.updateChannelMember(member,dto);
  }
}
