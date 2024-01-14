import {IPostMessageArgs, useDispatchAddMessage, usePostMessageThunk} from "./index";
import {useCurrentUser} from "../../../../../app/hooks/auth";
import {useCallback} from "react";
import {MediaStatus} from "../../channel-feed.model";
import {media as mediaClient} from "../../../../../api.client/client";
import {useAppDispatch} from "../../../../../app/hooks";
import {useMediaProgress} from "./use-media-progress";


/**
 *
 * @returns
 */
export function usePostMessage(channel:string) {

  const dispatch = useAppDispatch();
  const addMessage = useDispatchAddMessage();
  const sender = useCurrentUser();
  const postMessageThunk = usePostMessageThunk(channel);
  const mediaProgress = useMediaProgress();

  return useCallback(async function ({slug, content, media, onAfterAdd}: IPostMessageArgs) {
    if(!media){
      postMessageThunk(slug, {content,sender});
      return onAfterAdd ? onAfterAdd() : undefined;
    }
    const { uri,type,fileName } = media;
    addMessage({
      slug: slug,
      content: content,
      media: { uri,fileName,type, status: MediaStatus.pending },
    });
    onAfterAdd ? onAfterAdd():undefined;
    try {
      const [key, request] = mediaClient.upload(media.formData);
      mediaProgress.start(slug,key);
      const uploadedMedia = await request.reply({
        onUploadProgress: (e) => mediaProgress.update(slug,e.progress??0)
      });
      mediaProgress.complete(slug);
      postMessageThunk(slug, { content: content, media: uploadedMedia,sender});
    } catch (e) {
      mediaProgress.abort(slug);
    }
  }, [sender, postMessage, dispatch, addMessage,channel]);
}
