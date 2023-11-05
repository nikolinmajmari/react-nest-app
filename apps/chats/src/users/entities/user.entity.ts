import {Column, Entity, Index, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Exclude, Expose} from 'class-transformer';
import {IUserEntity} from "@mdm/mdm-core";
import Message from "../../channels/entities/message.entity";
import ChannelMember from "../../channels/entities/channel-member.entity";
import Notification from "../../notifications/notification.entity";

@Entity({
    name: "user"
})
export default class User implements IUserEntity {

    @PrimaryGeneratedColumn("uuid")
    id: string;
    @Index({fulltext: true})
    @Column({
        type: "varchar",
        length: "255"
    })
    firstName: string;
    @Index({fulltext: true})
    @Column({
        type: "varchar",
        length: "255"
    })
    lastName: string;
    @Index({fulltext: true, unique: true})
    @Column({
        type: "varchar",
        length: "255",
        unique: true,
    })
    email: string;
    @Exclude({toPlainOnly: true})
    @Column({
        type: "text"
    })
    password: string;
    @Column({
        type: "text"
    })
    avatar: string;
    @OneToMany(() => Message, (m) => m.sender, {lazy: true, onDelete: 'SET NULL'})
    messages: Message | Promise<Message>[];
    @OneToMany(() => ChannelMember, (m) => m.user, {lazy: true, onDelete: 'SET NULL'})
    members?: Promise<ChannelMember[]> | ChannelMember[];

    // @OneToMany(()=>Notification,notification=>notification.user)
    // notifications?:Promise<Notification[]>


    constructor(partial: Partial<User>) {
        Object.assign(this, partial);
    }

    @Expose()
    get fullName(): string {
        return `${this.firstName} ${this.lastName}`;
    }
}
