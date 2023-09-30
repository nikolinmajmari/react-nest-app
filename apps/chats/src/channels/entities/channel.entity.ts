import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import Message from "./message.entity";
import ChannelMember from "./channel-member.entity";
import { ChannelType, IChannel } from "@mdm/mdm-core";


@Entity({name: "channel"})
export default class Channel implements IChannel {
    constructor(partial:Partial<Channel>){
        Object.assign(this,partial);    
    }

    @PrimaryGeneratedColumn("uuid")
    id:string;


    @Column({
        type: "text",nullable:true,
        select: false,
    })
    alias?:string;


    @Column({
        type:"text"
    })
    avatar?:string;

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
    messages?: Promise<Message[]>| Message[];

    @OneToMany(()=>ChannelMember,member=>member.channel,{
        cascade:true,
        eager:true
    })
    members?: Promise<ChannelMember[]>|ChannelMember[];

    @OneToOne(
        ()=>Message,
    )
    @JoinColumn()
    lastMessage:Promise<Message>;

}