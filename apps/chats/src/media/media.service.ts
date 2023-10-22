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

@Injectable()
export class MediaService {

    constructor(
        private config: ConfigService<IEnvironment>,
        @InjectRepository(Media)
        private readonly repository: Repository<Media>
    ) {
    }


    async saveMedia(file: Express.Multer.File) {
        const media = new Media();
        media.fsPath = file.path;
        const thumbailDir = this.config.get("APP_MEDIA_PATH")
          + path.sep
          + 'thumbail';
        if(!await fs.existsSync(thumbailDir)){
          fs.mkdirSync(thumbailDir);
        }
        const thumbailPath =
          thumbailDir
          + path.sep
          + file.path.split(path.sep).pop();


        const write = fs.createWriteStream(thumbailPath);
        sharp(file.path)
          .resize(450,300)
          .pipe(write);
        media.thumbail = thumbailPath;
        media.type = MediaType.image;
        media.uri = '';
        const saved = await this.repository.save(media);
        saved.uri = `/api/media/${media.id}/download`;
        return await this.repository.save(media);
    }


    getMedia(id: string) {
        return this.repository.findOneByOrFail({id: id})
    }

    async getMediaStream(id: string) {
      try{
        const media = await this.getMedia(id);
        if(media.thumbail && fs.existsSync(media.thumbail)){
          console.log(fs.existsSync(media.thumbail),media.thumbail);
          return fs.createReadStream(media.thumbail);
        }

        return fs.createReadStream(media.thumbail??media.fsPath);
      }catch (e){
        console.log(e);
      }
    }

}
