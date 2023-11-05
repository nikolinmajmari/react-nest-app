import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import User from "../../users/entities/user.entity";
import Channel from "./channel.entity";
import {ApiProperty} from "@nestjs/swagger";
import {ChannelUserSettings, IChannelMemberEntity, MemberRole} from "@mdm/mdm-core";

@Entity({name: "channel_member"})
export default class ChannelMember implements IChannelMemberEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ApiProperty()
    @Column({
        type: "enum",
        enum: [MemberRole.admin, MemberRole.member]
    })
    role: MemberRole;

    @ApiProperty({type: "string"})
    @ManyToOne(() => User, {eager: true})
    user: User;

    @Column({
        type: 'jsonb',
        nullable: true,
        default: {}
    })
    settings: ChannelUserSettings;

    /// admin configurable permissions
    @Column({
      type:"boolean",
      default:true,
    })
    allowSentMessages:boolean;

    @CreateDateColumn({type: "date"})
    createdAt: Date;

    @ManyToOne(() => Channel, channel => channel.members, {onDelete: 'CASCADE'})
    channel: Promise<Channel>;
    constructor(partial: Partial<ChannelMember>) {
        Object.assign(this, partial);
    }

}
