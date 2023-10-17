import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { IEnvironment } from "../common/configurations.module";
import { InjectRepository } from "@nestjs/typeorm";
import Media from "./media.entity";
import { Repository } from "typeorm";
import { MediaType } from "@mdm/mdm-core";
import fs from 'node:fs';


@Injectable()
export class MediaService{

    constructor(
        private config:ConfigService<IEnvironment>,
        @InjectRepository(Media)
        private readonly repository: Repository<Media>
    ){}


    async saveMedia(file:Express.Multer.File){
        const media = new Media();
        media.fsPath = file.path;
        media.type = MediaType.image;
        media.uri = '';
        const saved = await this.repository.save(media);
        saved.uri = `/api/media/${media.id}/download`;
        return await this.repository.save(media);
    }


    getMedia(id:string){
        return this.repository.findOneByOrFail({id:id})
    }

    async getMediaStream(id:string){
        const media = await this.getMedia(id);
        return fs.createReadStream(media.fsPath);
    }

}