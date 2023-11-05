import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import User from "../users/entities/user.entity";


enum NotificationContext{
  chatMessage='chatMessage',
  chatVoiceCall='chatVoiceCall',
  chatVideoCall='chatVideoCall',
}

@Entity({
  name:'notification'
})
export default class Notification {

  @PrimaryGeneratedColumn('uuid')
  id:string;

  @Column({ type:"varchar", length:256,nullable:true })
  context:string|null;

  @Column({type: 'uuid'})
  subject:string|null;

  @Column({type:'varchar',length:256})
  title:string;

  @Column({type:"text"})
  content:string;

  @Column({type:"varchar",length:256,nullable:true})
  image:string|null;

  @ManyToOne(()=>User,{eager:true})
  user:User;

  @CreateDateColumn({type: "date"})
  createdAt: Date;

  @CreateDateColumn({type: "date",nullable:true})
  receivedAt: Date;

}
