import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import Media from "./media.entity";
import {Repository} from "typeorm";
import {MediaType} from "@mdm/mdm-core";
import fs from 'node:fs';
import {MediaThumbnailService} from "./media-thumbail.service";
import config from "./config/media.type.config";
import {MediaContext, MediaContextDTO, sizeConfig} from "./media.config";

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

    getThumbnailSize(context?:MediaContext){
      const config =  {height:280,width: 420};
      if(!context){
        return config;
      }
      return sizeConfig[context] ?? config;
    }

    async saveMedia(file: Express.Multer.File,dto?:MediaContextDTO) {
        const media = new Media();
        media.fsPath = file.path;
        media.fileName = file.originalname;
        media.type = this.getMediaType(file);
        media.uri = '';
        const saved = await this.repository.save(media);
        saved.uri = `/api/media/${media.id}/content`;
        await this.thumbnailService.createThumbnail(media,this.getThumbnailSize(dto.context));
        return await this.repository.save(media);
    }

    getMedia(id: string) {
        return this.repository.findOneByOrFail({id: id})
    }

    async getMediaStream(media:Media) {
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

    async deleteMedia(media:Media){
      return await Promise.all([
        this.repository.remove([media]),
        fs.promises.unlink(media.fsPath),
        media.hasThumbnail()?fs.promises.unlink(media.thumbnail):null
      ]);
    }

}
