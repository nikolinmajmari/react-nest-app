import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import Message from "./message.entity";
import ChannelMember from "./channel-member.entity";
import { ChannelType, IChannel } from "@mdm/mdm-core";
import { Expose,} from "class-transformer";
import { CommonEntity } from "../../common/common.entity";


@Entity({name: "channel"})
export default class Channel extends CommonEntity implements IChannel {
    constructor(partial:Partial<Channel>){
        super();  
        Object.assign(this,partial); 
    
    }

    @PrimaryGeneratedColumn("uuid")
    id:string;


    @Column({
        type: "text",
        nullable:true,
        select: false,
    })
    alias:string|null;


    @Column({
        type:"text",
        nullable:true,
        select: false,
    })
    avatar:string|null;

    @Column({
        type: "enum",
        enum:[ChannelType.private,ChannelType.group]
    })
    type: ChannelType;


    @CreateDateColumn({
        type: "timestamp",
    })
    createdAt:Date;


    @OneToMany(()=>Message,message=>message.channel,{
        cascade:true,
    })
    messages: Promise<Message[]>;

    @OneToMany(()=>ChannelMember,member=>member.channel,{
        cascade:true,
    })
    @Expose({
        name:'members'
    })
    members: Promise<ChannelMember[]>;

    @OneToOne(
        ()=>Message,
    )
    @JoinColumn()
    lastMessage:Promise<Message|null>;

}