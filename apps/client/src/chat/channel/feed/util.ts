import {MediaType} from "@mdm/mdm-core";

//todo move to @mdm/mdm-core
export const config: { [key: string]: MediaType } = {
  'audio/webm;codecs=opus':MediaType.audio,
  "audio/mpeg": MediaType.audio,
  "audio/vorbis": MediaType.audio,

  /// images
  "image/jpeg": MediaType.image, "image/png": MediaType.image, "image/svg+xml": MediaType.image,

  /// video
  "video/mp4": MediaType.video,

  /// files
  "application/octet-stream": MediaType.file, "application/pdf": MediaType.pdf,

}
