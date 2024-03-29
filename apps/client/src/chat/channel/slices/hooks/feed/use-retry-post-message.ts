import {IFeedMessage} from "../../channel-feed.model";
import {useCurrentUser} from "../../../../../app/hooks/auth";
import {useAppDispatch} from "../../../../../app/hooks";
import React, {useCallback} from "react";
import {media as mediaClient} from "../../../../../api.client/client";
import {IMedia} from "@mdm/mdm-core";
import {usePostMessageThunk} from "./index";
import {useMediaProgress} from "./use-media-progress";
import {AxiosRequestConfig} from "axios";
import {ChannelContext} from "../../../providers/ChannelProvider";

export function useRetryPostMessage( message: IFeedMessage) {
  const slug = message.slug!;
  const user = useCurrentUser();
  const {channel} = React.useContext(ChannelContext);
  const postMessage = usePostMessageThunk(channel!.id);

  const mediaProgress = useMediaProgress();
  return useCallback(async function () {
    if (message.media && message.media.operation) {
      const request = mediaClient.storage.get<IMedia,AxiosRequestConfig>(message.media.operation.requestKey)!;
      try {
        mediaProgress.restart(message.slug!)
        const uploadedMedia = await request.reply({
          onUploadProgress: (e:any) => mediaProgress.update(slug, e.progress ?? 0),
        });
        mediaProgress.complete(slug);
        return await postMessage(slug, {
          content: message.content,
          media: uploadedMedia,
          sender: user
        });
      } catch (e) {
        return mediaProgress.abort(slug)
      }
    }
    return postMessage(slug, {
      content: message.content,
      sender: user
    });
  }, [message, channel, user])
}
