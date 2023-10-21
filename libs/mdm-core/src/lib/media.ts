export enum MediaType{
  image="media/image",
  video="media/video",
  recording="media/voice",
  file="media/file"
}
export interface IMediaEntity{
  id:string;
  uri:string;
  type: MediaType;
  fsPath:string;
}

export type IMedia = Omit<IMediaEntity,"fsPath">;

export type IPartialMedia = Partial<IMedia>;
