export enum MediaType{
  image="media/image",
  video="media/video",
  recording="media/voice",
  file="media/file"
}
export interface IMedia{
  id:string;
  uri:string;
  type: MediaType;
  fsPath:string;
}

export type IPartialMedia = Partial<IMedia>;

export type IExposedMedia = Omit<IMedia,"fsPath">;