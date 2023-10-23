import {Injectable} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import {IEnvironment} from "../common/configurations.module";
import Media from "./media.entity";
import {MediaType} from "@mdm/mdm-core";
import fs from 'node:fs';
import fsPromises from 'node:fs/promises';
import sharp from "sharp";
import * as path from "path";
import {Poppler} from "node-poppler";

@Injectable()
export class MediaThumbnailService {

  constructor(
    private config: ConfigService<IEnvironment>,
  ) {
    this.init();
  }

  init(){
    if(!fs.existsSync(this.getThumbnailMediaPath())){
      fs.mkdirSync(this.getThumbnailMediaPath(),{recursive:true});
    }
  }

  getThumbnailMediaPath(){
    return this.config.get("APP_MEDIA_THUMBNAIL_PATH");
  }

  createThumbnailForImage(media:Media,size:{height:number,width:number}){
    const name = media.fsPath.split(path.sep).pop();
    const thumbnailPath = `${this.getThumbnailMediaPath()}${path.sep}${name}`;
    const write = fs.createWriteStream(
      thumbnailPath
    );
    sharp(media.fsPath)
      .resize(size.width,size.height)
      .pipe(write);
    media.thumbnail = thumbnailPath;
  }
  async createThumbnailForPdf(media:Media,size:{height:number,width:number}){
    try {
      const name = media.fsPath.split(path.sep).pop();
      const thumbnailPath = `${this.getThumbnailMediaPath()}${path.sep}${name}`;
      const poppler = new Poppler();
      const buffer = await poppler.pdfToCairo(
        media.fsPath,
        undefined,
        {pngFile:true,firstPageToConvert:1,singleFile:true})
      await fsPromises.writeFile(thumbnailPath,buffer,{encoding:'binary'});
      media.thumbnail = thumbnailPath;
    }catch (e){
      console.log(e);
    }
  }



  async createThumbnail(media:Media,size:{height:number,width:number}){
    if(media.type===MediaType.image){
      return this.createThumbnailForImage(media,size);
    }else if(media.type===MediaType.pdf){
      return this.createThumbnailForPdf(media,size);
    }
    return null;
  }
  getThumbnailStream(media:Media){
    if(media.thumbnail){
      return fs.createReadStream(media.thumbnail)
    }
    return null;
  }
}
