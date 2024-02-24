import {Column, Entity, ManyToOne, PrimaryGeneratedColumn, Timestamp} from "typeorm";
import User from "../../users/entities/user.entity";
import Message from "./message.entity";


@Entity({name:'message_recipient'})
export default class MessageRecipient{

  @PrimaryGeneratedColumn('uuid')
  id:string;

  @ManyToOne(()=>User,{onDelete:'SET NULL',eager:true})
  recipient: User;

  @ManyToOne(()=>Message,{onDelete:"CASCADE"})
  message: Promise<Message>;

  @Column({type:"timestamp",nullable:true,default:null})
  delivered:any|null;

  @Column({type:"timestamp",nullable:true,default:null})
  read:any|null;

  constructor(partial:Partial<MessageRecipient>) {
    Object.assign(this,partial);
  }
}
