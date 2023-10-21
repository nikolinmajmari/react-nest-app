import {createAsyncThunk} from "@reduxjs/toolkit";
import {channels} from "../../../../api.client/client";
import {IFeedMessage} from "../channel-feed.model";

const loadFeedThunk = createAsyncThunk<IFeedMessage[], string>(
  "/channels/messages/paginate", async function (channelId) {
    return (await channels.getChannelMessages(channelId)).map(
      (message) => {
        const uri = message.media ? `http://127.0.0.1:3000${message.media.uri}` : null
        const media = message.media ?
          {
            ...message.media,
            uploadType: false,
            uri
          }
          :
          null;
        return {...message, media};
      }
    ) as IFeedMessage[];
  }
);

export default loadFeedThunk;
