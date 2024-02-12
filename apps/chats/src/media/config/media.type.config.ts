import {MediaType} from "@mdm/mdm-core";

export interface IMediaTypeConfig{
  [key:string]:MediaType
}

const config =  {
  "audio/mpeg":MediaType.audio,
  "audio/webm":MediaType.audio,
  "audio/vorbis":MediaType.audio,
  "audio/webm;codecs=opus":MediaType.audio,

  /// images
  "image/jpeg":MediaType.image,
  "image/png":MediaType.image,
  "image/svg+xml":MediaType.image,

  /// video
  "video/mp4":MediaType.video,

  /// files
  "application/octet-stream":MediaType.file,
  "application/pdf":MediaType.pdf,

} as IMediaTypeConfig;

export default config;
