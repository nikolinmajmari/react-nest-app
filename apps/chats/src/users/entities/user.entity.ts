import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";


@Entity({
    name:"user"
})
export default class User{

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({
        type: "varchar",
        length:"255"
    })
    firstName:string;

    @Column({
        type: "varchar",
        length:"255"
    })
    lastName:string;

    @Column({
        type: "varchar",
        length:"255",
        unique: true,
    })
    email:string;

    @Column({
        type:"text"
    })
    password:string;

    @Column({
        type:"text"
    })
    avatar:string;
}