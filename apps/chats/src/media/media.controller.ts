import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  MaxFileSizeValidator, NotFoundException,
  Param,
  ParseFilePipe,
  Post, Query,
  Res,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common';
import {FileInterceptor} from "@nestjs/platform-express";
import {ApiBody, ApiConsumes, ApiTags} from '@nestjs/swagger';
import {Public} from '../auth/decorator';
import {Response} from 'express';
import {MediaService} from './media.service';
import multer from "multer";
import {MediaContextDTO} from "./media.config";
import {MediaThumbnailService} from "./media-thumbail.service";
import mediaTypeConfig from "./config/media.type.config";


@ApiTags("aamedia")
@Controller('media')
export class MediaController {

    constructor(
        private readonly service: MediaService,
        private readonly thumbnailService:MediaThumbnailService
    ) {}

    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    @Public()
    @Post('')
    @UseInterceptors(FileInterceptor('file'))
    upload(@UploadedFile(
               new ParseFilePipe({
                   validators: [
                       new MaxFileSizeValidator({maxSize: 10000000000000000}),
                   ],
                   errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
               })
           ) file: Express.Multer.File,
           @Body() dto:MediaContextDTO
    ) {
      return  this.service.saveMedia(file,dto);
    }




    @Get(':id')
    @HttpCode(HttpStatus.OK)
    @Public()
    async get(@Param('id') id: string) {
        return await this.service.getMedia(id);
    }

    @Get(':id/content')
    @HttpCode(HttpStatus.OK)
    @Public()
    async download(
      @Param('id') id: string,
      @Res() res: Response,
      @Query('thumbnail') thumbnail:string,
    ) {
        const readable = await this.service.getMediaStream(id);
        if(!readable){
          throw new NotFoundException();
        }
        readable
          .on('error',(error)=>res.status(500).json(error) )
          .pipe(res);
    }


  @Get(':id/thumbnail')
  @HttpCode(HttpStatus.OK)
  @Public()
  async thumbnail(
    @Param('id') id: string,
    @Res() res: Response,
    @Query('thumbnail') thumbnail:string,
  ) {
    const readable = await this.service.getMediaThumbnailStream(id);
    if(!readable){
      throw new NotFoundException();
    }
    readable
      .on('error',(error)=>res.status(500).json(error) )
      .pipe(res);
  }
}
