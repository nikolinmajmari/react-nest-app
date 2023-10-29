import {IFeedMessageMedia} from "../../../slices/channel-feed.model";
import {MediaType} from "@mdm/mdm-core";
import {DownloadableFileTile, FileTile, ProgressAction, ReloadAction} from "./FileComponents";
import React from "react";
import {MessageContentImage} from "./ImageComponents";

export interface IMessageMediaProps {
  media: IFeedMessageMedia;
  cancelProgress: () => void;
  restartProgress: () => void;
}


export function MessageMediaContent(props: IMessageMediaProps) {
  const {media} = props;
  let url = media.id ? `http://127.0.0.1:3000/api/media/${props.media.id}/content` : media.uri;
  if (media.type === MediaType.image || media.type === MediaType.pdf) {
    url = media.id ? `http://127.0.0.1:3000/api/media/${props.media.id}/thumbnail` : media.uri;
  }
  if (media.type === MediaType.image || media.type === MediaType.pdf) {
    return (<div className={media.uploadType && media.operation ? 'blur-sm' : ''}>
      <MessageContentImage src={url}/>
    </div>);
  } else if (media.uploadType && media.operation) {

    return (<FileTile
      type={MediaType.file}
      fileName={props.media.fileName!}
      action={ props.media!.operation!.progress !== 0 ?
        <ProgressAction
          progress={props.media.operation!.progress}
          cancel={props.cancelProgress}
        />
        :
        <ReloadAction
          reload={props.restartProgress}
        />
      }
    />);
  }
  return (
    <DownloadableFileTile type={MediaType.file} fileName={props.media.fileName!} url={url!}/>
  );
}
