import { Multer } from 'multer';
import { Controller, FileTypeValidator, Get, HttpStatus, MaxFileSizeValidator, Param, ParseFilePipe, Post, Req, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import {FileInterceptor} from "@nestjs/platform-express";
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/decorator';
import { Request, Response } from 'express';
import fs from "fs";
import { MediaService } from './media.service';


@ApiTags("aamedia")
@Controller('media')
export class MediaController {

    constructor(
        private readonly service:MediaService
    ){}
 
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
    },})
    @Public()
    @Post('')
    @UseInterceptors(FileInterceptor('file'))
    upload(@UploadedFile(
        new ParseFilePipe({
            validators:[
                new MaxFileSizeValidator({maxSize:10000000}),
                new FileTypeValidator({fileType:'image/jpeg'})
            ],
            errorHttpStatusCode:HttpStatus.UNPROCESSABLE_ENTITY
        })
    ) file:Express.Multer.File
    ){
        return this.service.saveMedia(file);
    }

    @Get(':id')
    @Public()
    async download(@Param('id') id:string,@Res() res:Response){

        const readable = await this.service.getMediaStream(id);
        readable.pipe(res);

    }
}
