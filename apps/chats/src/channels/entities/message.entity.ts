import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import Channel from "./channel.entity";
import User from "../../users/entities/user.entity";
import {IMessageEntity} from "@mdm/mdm-core";
import Media from "../../media/media.entity";
import {CommonEntity} from "../../common/common.entity";
import MessageRecipient from "./message-recipient.entity";


@Entity({name: "message"})
export default class Message extends CommonEntity implements IMessageEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @OneToOne(() => Media)
    @JoinColumn()
    media: Promise<Media | null>;

    @Column({type: "text"})
    content: string;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(() => User, {onDelete: "SET NULL", eager: true})
    sender: Promise<User>;

    @ManyToOne(() => Channel, channel => channel.messages, {onDelete: 'CASCADE'})
    channel: Promise<Channel>;

    @OneToMany(()=>MessageRecipient,recipient=>recipient.message,{
      cascade:true
    })
    recipients:Promise<MessageRecipient[]>

    constructor(partial: Partial<Message>) {
        super();
        Object.assign(this, partial);
    }

}
