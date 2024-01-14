import {MediaType} from "@mdm/mdm-core";

export function setEndOfContenteditable(contentEditableElement: HTMLElement) {
  var range, selection;
  if (document.createRange)//Firefox, Chrome, Opera, Safari, IE 9+
  {
    range = document.createRange();//Create a range (a range is a like the selection but invisible)
    range.selectNodeContents(contentEditableElement);//Select the entire contents of the element with the range
    range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
    selection = window.getSelection();//get the selection object (allows you to change selection)
    selection?.removeAllRanges();//remove any selections already made
    selection?.addRange(range);//make the range you have just created the visible selection
  }
}

export const config: { [key: string]: MediaType } = {
  "audio/mpeg": MediaType.audio, "audio/vorbis": MediaType.audio,

  /// images
  "image/jpeg": MediaType.image, "image/png": MediaType.image, "image/svg+xml": MediaType.image,

  /// video
  "video/mp4": MediaType.video,

  /// files
  "application/octet-stream": MediaType.file, "application/pdf": MediaType.pdf,

}
