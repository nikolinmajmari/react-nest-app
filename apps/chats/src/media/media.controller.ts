import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import {FileInterceptor} from "@nestjs/platform-express";

@Controller('media')
export class MediaController {
    
    @Post('')
    @UseInterceptors(FileInterceptor('file'))
    upload(@UploadedFile() file){
        return file.name;
    }
}
