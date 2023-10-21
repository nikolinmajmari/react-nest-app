import {
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    MaxFileSizeValidator,
    Param,
    ParseFilePipe,
    Post,
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


@ApiTags("aamedia")
@Controller('media')
export class MediaController {

    constructor(
        private readonly service: MediaService
    ) {
        multer.toString();
    }

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
           ) file: Express.Multer.File
    ) {
        return this.service.saveMedia(file);
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    @Public()
    async get(@Param('id') id: string) {
        return await this.service.getMedia(id);
    }

    @Get(':id/download')
    @HttpCode(HttpStatus.OK)
    @Public()
    async download(@Param('id') id: string, @Res() res: Response) {
        const readable = await this.service.getMediaStream(id);
        readable.pipe(res);
    }
}
