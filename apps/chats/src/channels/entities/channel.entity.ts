import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  VirtualColumn
} from "typeorm";
import Message from "./message.entity";
import ChannelMember from "./channel-member.entity";
import {ChannelType, IChannelEntity} from "@mdm/mdm-core";
import {Expose,} from "class-transformer";
import {CommonEntity} from "../../common/common.entity";
import {Virtual} from "../../common/decorators/virtual";


@Entity({name: "channel"})
export default class Channel extends CommonEntity implements IChannelEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;
    @Column({
        type: "text",
        nullable: true,
        select: false,
    })
    alias: string | null;
    @Column({
        type: "text",
        nullable: true,
        select: false,
    })
    avatar: string | null;
    @Column({
        type: "enum",
        enum: [ChannelType.private, ChannelType.group]
    })
    type: ChannelType;
    @CreateDateColumn({
        type: "timestamp",
    })
    createdAt: Date;
    @OneToMany(() => Message, message => message.channel, {
        cascade: true,
    })
    messages: Promise<Message[]>;

    @OneToMany(() => ChannelMember, member => member.channel, {
        cascade: true,
    })
    members: Promise<ChannelMember[]>;
    @OneToOne(
        () => Message, {
          onDelete:'SET NULL'
        })
    @JoinColumn()
    lastMessage: Promise<Message | null>;


    @Virtual()
    unread: number | null;

    constructor(partial: Partial<Channel>) {
        super();
        Object.assign(this, partial);
    }

}
