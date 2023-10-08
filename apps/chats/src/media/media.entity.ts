import { IMedia, MediaType } from "@mdm/mdm-core";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";




@Entity({name:"media"})
export default class Media implements IMedia{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type:"varchar",length:256})
    uri: string;

    
    @Column({type:"enum",enum:[
        MediaType.file,MediaType.image,MediaType.recording,MediaType.video
    ]})
    type: MediaType;

    @Column({type:"varchar",length:256})
    fsPath: string;

}