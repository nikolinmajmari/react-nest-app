import {IsBoolean, IsOptional} from "class-validator";
import {ChannelUserSettings} from "../entities/channel-settings";
import {MemberRole} from "@mdm/mdm-core";


export class UpdateChannelSettingsDTO implements ChannelUserSettings {
    @IsBoolean()
    @IsOptional()
    muteNotifications?: boolean;
}


export class UpdateChannelmemberDTO {
    role: MemberRole;
}
