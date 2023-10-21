import {
    Body,
    Controller,
    Delete,
    ForbiddenException,
    HttpCode,
    HttpStatus,
    Param,
    Patch,
    Put,
    Req,
    UnauthorizedException
} from "@nestjs/common";
import {UpdateChannelmemberDTO, UpdateChannelSettingsDTO} from "../dto/channel.member.dto";
import {MembersService} from "../services/members.service";
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";
import User from "../../users/entities/user.entity";
import {MemberRole} from "@mdm/mdm-core";


@ApiBearerAuth()
@ApiTags("members")
@Controller('members')
export class MembersController {
    constructor(
        private readonly service: MembersService
    ) {
    }

    @Put(':id/settings')
    @HttpCode(HttpStatus.ACCEPTED)
    async updateMemberSettings(
        @Req() request,
        @Param('id') id: string,
        @Body() dto: UpdateChannelSettingsDTO
    ) {
        const member = await this.service.findUserMemberById(id, request.user);
        return await this.service.updateChannelMemberSettings(
            member, dto
        );
    }


    @Patch(':id')
    @HttpCode(HttpStatus.ACCEPTED)
    async updateMember(
        @Req() request,
        @Param('id') id: string,
        @Body() dto: UpdateChannelmemberDTO
    ) {
        const member = await this.service.findUserMemberById(id, request.user);
        const userMember = await this.service.findUserMemberByChannel(
            await member.channel, request.user
        );
        if (userMember.role === MemberRole.admin) {
            //// only admin can update role property of members and themself
            return await this.service.updateChannelMember(member, dto);
        }
        throw new ForbiddenException('You can not update this member role');
    }


    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteMember(
        @Req() request,
        @Param('id') id: string,
    ) {
        const member = await this.service.findMember(id);
        const owner = await this.service.findUserMemberByChannel(
            await member.channel,
            request.user
        );
        if (owner.role === MemberRole.admin || (await member.user as User).id === request.user.id) {
            /// check if user is admin
            /// check if user is owner
            return await this.service.removeMember(member);
        }
        throw new UnauthorizedException();
    }


}
