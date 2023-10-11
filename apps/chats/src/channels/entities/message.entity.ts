import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import Channel from "./channel.entity";
import User from "../../users/entities/user.entity";
import { IMessage, MessageType } from "@mdm/mdm-core";
import { string } from "joi";
import Media from "../../media/media.entity";


@Entity({name: "message"})
export default class Message implements IMessage{
    constructor(partial:Partial<Message>){
        Object.assign(this,partial);    
    }
    @PrimaryGeneratedColumn("uuid")
    id?:string;

    @Column({type:"enum",enum:[
        MessageType.file,MessageType.image,MessageType.recording,MessageType.text,MessageType.video
    ]})
    type: MessageType;

    @OneToOne(()=>Media)
    @JoinColumn()
    media?: string;

    @Column({type:"text"})
    content: string;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(()=>User,{onDelete:"SET NULL",eager:true})
    sender: User|Promise<User>;

    @ManyToOne(()=>Channel,channel=>channel.messages,{onDelete: 'CASCADE'})
    channel?: Promise<Channel>|Channel;
}