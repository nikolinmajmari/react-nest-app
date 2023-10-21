import {createAsyncThunk} from "@reduxjs/toolkit";
import {channels} from "../../../../api.client/client";
import {IFeedMessage} from "../channel-feed.model";
import {IUser} from "@mdm/mdm-core";

export interface IPostMessageArgs {
  slug: string;
  user: IUser,
  channelId: string,
  message: Pick<IFeedMessage, "content" | "media">
}

const postMessageThunk = createAsyncThunk<IFeedMessage, IPostMessageArgs>(
  '/channels/messages/post', async (args, thunkapi) => {
    const {message, user, channelId, slug} = args;
    const id = await channels.postChannelMessage(channelId, {
      content: message.content ?? "",
      media: message.media?.id,
      sender: user.id
    });
    return {
      id,
      slug: slug,
      media: message.media,
      content: message.content,
      sender: user,
      createdAt: (new Date()).toString() as unknown
    } as IFeedMessage;
  }
);

export default postMessageThunk;
