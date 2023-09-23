import { Column, Entity, Index, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Exclude, Expose } from 'class-transformer';
import { IUser } from "@mdm/mdm-core";
import Message from "../../channels/entities/message.entity";

@Entity({
    name:"user"
})
export default class User implements IUser{
    
    constructor(partial:Partial<User>){
        Object.assign(this,partial);
    }

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Index({fulltext:true})
    @Column({
        type: "varchar",
        length:"255"
    })
    firstName:string;

    @Index({fulltext:true})
    @Column({
        type: "varchar",
        length:"255"
    })
    lastName:string;

    @Expose()
    get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
    }


    @Index({fulltext:true,unique:true})
    @Column({
        type: "varchar",
        length:"255",
        unique: true,
    })
    email:string;

    @Exclude({ toPlainOnly: true })
    @Column({
        type:"text"
    })
    password:string;

    @Column({
        type:"text"
    })
    avatar:string;

    @OneToMany(()=>Message,(m)=>m.sender,{lazy:true,onDelete:'SET NULL'})
    messages: Message|Promise<Message>;
}