import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import Channel from "./channel.entity";
import User from "../../users/entities/user.entity";
import { MessageType } from "@mdm/mdm-core";


@Entity({name: "message"})
export default class Message{
    constructor(partial:Partial<Message>){
        Object.assign(this,partial);    
    }
    @PrimaryGeneratedColumn("uuid")
    id:string;

    @Column({type:"enum",enum:[
        MessageType.file,MessageType.image,MessageType.recording,MessageType.text,MessageType.video
    ]})
    type: MessageType;

    @Column({type:"text"})
    content: string;

    @Column({type: "date"})
    createdAt: Date;

    @ManyToOne(()=>User,{onDelete:"SET NULL",eager:true})
    sender: User;

    @ManyToOne(()=>Channel,channel=>channel.messages,{onDelete: 'CASCADE'})
    channel?: Promise<Channel>;
}