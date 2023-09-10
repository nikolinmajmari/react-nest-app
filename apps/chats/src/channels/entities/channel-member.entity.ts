import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import User from "../../users/entities/user.entity";
import Channel from "./channel.entity";
import { ApiProperty } from "@nestjs/swagger";
import { ChannelUserSettings, IChannelMember, MemberRole } from "@mdm/mdm-core";

@Entity({name: "channel_member"})
export default class ChannelMember implements IChannelMember{
    constructor(partial:Partial<ChannelMember>){
        Object.assign(this,partial);    
    }

    @PrimaryGeneratedColumn("uuid")
    id:string;

    @ApiProperty()
    @Column({
        type: "enum",
        enum:[MemberRole.admin,MemberRole.member]
    })
    role: MemberRole;
    
    @ApiProperty({type:"string"})
    @ManyToOne(()=>User)
    user: Promise<User>|User|string;


    @Column({
        type: 'jsonb',
        nullable: true,
        default: {}
    })
    settings:ChannelUserSettings;

    @CreateDateColumn({type:"date"})
    createdAt?:Date;

    @ManyToOne(()=>Channel,channel=>channel.members,{onDelete: 'CASCADE'})
    channel?: Promise<Channel>;

}