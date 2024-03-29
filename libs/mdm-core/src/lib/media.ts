export enum MediaType{
  image="media/image",
  video="media/video",
  recording="media/voice",
  audio="media/audio",
  file="media/file",
  pdf="media/pdf",
}
export interface IMediaEntity{
  id:string;
  uri:string;
  type: MediaType;
  fileName:string;
  fsPath:string;
  thumbnail:string;
}

export type IMedia = Pick<IMediaEntity,"id"|"uri"|"type"|"fileName">;

export type IPartialMedia = Partial<IMedia>;
