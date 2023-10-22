import {Injectable} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import {IEnvironment} from "../common/configurations.module";
import {InjectRepository} from "@nestjs/typeorm";
import Media from "./media.entity";
import {Repository} from "typeorm";
import {MediaType} from "@mdm/mdm-core";
import fs from 'node:fs';
import fsPromises from "node:fs/promises";
import sharp from "sharp";
import * as path from "path";
import {MediaThumbnailService} from "./media-thumbail.service";

@Injectable()
export class MediaService {

    constructor(
        private config: ConfigService<IEnvironment>,
        @InjectRepository(Media)
        private readonly repository: Repository<Media>,
        private  thumbnailService:MediaThumbnailService
    ) {
    }


    async saveMedia(file: Express.Multer.File) {
        const media = new Media();
        media.fsPath = file.path;
        media.type = MediaType.image;
        media.uri = '';
        this.thumbnailService.createThumbnail(media);
        const saved = await this.repository.save(media);
        saved.uri = `/api/media/${media.id}/download`;
        return await this.repository.save(media);
    }


    getMedia(id: string) {
        return this.repository.findOneByOrFail({id: id})
    }

    async getMediaStream(id: string) {
      const media = await this.getMedia(id);
      const thumbnailStream  = this.thumbnailService.getThumbnailStream(media);
      if(!thumbnailStream){
        return fs.createReadStream(media.fsPath);
      }
      return thumbnailStream;
    }

}
