import {IsEnum, IsOptional} from "class-validator";

export enum MediaContext{
  Feed="feed",
  Avatar="avatar",
  Icon="icon"
}

export class MediaContextDTO {

  @IsEnum(MediaContext)
  @IsOptional()
  context:MediaContext;
}

export const sizeConfig = {
  [MediaContext.Feed]:{height:400,width:600},
  [MediaContext.Avatar]:{height:100,width:150},
  [MediaContext.Icon]:{height:60,width:90}
};
