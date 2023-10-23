import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import Media from "./media.entity";
import {Repository} from "typeorm";
import {MediaType} from "@mdm/mdm-core";
import fs from 'node:fs';
import {MediaThumbnailService} from "./media-thumbail.service";
import config from "./config/media.type.config";
import {ThumbnailDto} from "./thumbnail.dto";

@Injectable()
export class MediaService {

    constructor(
        @InjectRepository(Media)
        private readonly repository: Repository<Media>,
        private  thumbnailService:MediaThumbnailService
    ) {}


    getMediaType(file:Express.Multer.File){
      return config[file.mimetype]??MediaType.file;
    }

    async saveMedia(file: Express.Multer.File,dto?:ThumbnailDto) {
        const media = new Media();
        media.fsPath = file.path;
        media.type = this.getMediaType(file);
        console.log(media.type,file.mimetype);
        media.uri = '';
        const saved = await this.repository.save(media);
        saved.uri = `/api/media/${media.id}/content`;
        if(media.type===MediaType.image || media.type === MediaType.pdf){
          await this.thumbnailService.createThumbnail(media,{
            width:420,
            height:280
          });
        }
        console.log(media);
        return await this.repository.save(media);
    }

    getMedia(id: string) {
        return this.repository.findOneByOrFail({id: id})
    }

    async getMediaStream(id: string,thumbnail?:boolean) {
      const media = await this.getMedia(id);
      if(media.fsPath){
        return fs.createReadStream(media.fsPath);
      }
    }

    async getMediaThumbnailStream(id:string){
      const media = await this.getMedia(id);
      if(media.thumbnail){
        return fs.createReadStream(media.thumbnail);
      }
      return null;
    }

}
