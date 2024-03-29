import {IMediaEntity, MediaType} from "@mdm/mdm-core";
import {Exclude} from "class-transformer";
import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";


@Entity({name: "media"})
export default class Media implements IMediaEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type: "varchar", length: 256})
    uri: string;

    @Column({
        type: "enum", enum: [
            MediaType.file, MediaType.image, MediaType.recording, MediaType.video,
            MediaType.pdf,MediaType.audio,
        ]
    })
    type: MediaType;

    @Column({type:'varchar',length:256})
    fileName:string;

    @Exclude()
    @Column({type: "varchar", length: 256})
    fsPath: string;

    @Exclude()
    @Column({type:"varchar",length:256,nullable:true})
    thumbnail:string|null;


    @Exclude()
    hasThumbnail():boolean{
      return this.thumbnail !== null;
    }
}
