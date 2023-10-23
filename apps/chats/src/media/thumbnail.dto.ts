import {IsNumber} from "@nestjs/class-validator";
import {IsOptional} from "class-validator";

export class ThumbnailDto{

  @IsNumber()
  @IsOptional()
  thumbnailHeight?:number;

  @IsNumber()
  @IsOptional()
  thumbnailWidth?:number;
}
