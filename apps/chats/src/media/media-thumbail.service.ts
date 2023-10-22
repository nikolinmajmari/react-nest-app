import {Injectable} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import {IEnvironment} from "../common/configurations.module";
import {InjectRepository} from "@nestjs/typeorm";
import Media from "./media.entity";
import {Repository} from "typeorm";
import {IMedia, MediaType} from "@mdm/mdm-core";
import fs from 'node:fs';
import fsPromises from "node:fs/promises";
import sharp from "sharp";
import * as path from "path";

@Injectable()
export class MediaThumbnailService {

  constructor(
    private config: ConfigService<IEnvironment>,
  ) {
    this.init();
  }

  init(){
    if(!fs.existsSync(this.getThumbnailMediaPath())){
      fs.mkdirSync(this.getThumbnailMediaPath());
    }
  }

  getThumbnailMediaPath(){
    return this.config.get("APP_MEDIA_THUMBNAIL_PATH");
  }

  createThumbnail(media:Media){
    const name = media.fsPath.split(path.sep).pop();
    const thumbnailPath = `${this.getThumbnailMediaPath()}${path.sep}${name}`;
    const write = fs.createWriteStream(
      thumbnailPath
    );
    sharp(media.fsPath)
      .resize(450,300)
      .pipe(write);
    media.thumbail = thumbnailPath;
  }
  getThumbnailStream(media:Media){
    if(media.thumbail && fs.existsSync(media.thumbail)){
      return fs.createReadStream(media.thumbail)
    }
    return null;
  }
}
