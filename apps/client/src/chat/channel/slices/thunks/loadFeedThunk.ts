import { createAsyncThunk } from "@reduxjs/toolkit";
import { channels } from "../../../../api.client/client";
import { IFeedMessage, IMessageMedia } from "../channel-feed.model";

const loadFeedThunk = createAsyncThunk<IFeedMessage[],string>(
    "/channels/messages/paginate",async function(channelId,thunkapi){
        return (await channels.getChannelMessages<IFeedMessage>(channelId)).map(
            (message)=>{
                const uri =  message.media ? `http://127.0.0.1:3000${(message.media as Partial<IMedia>).uri}`:null
                const media = message.media ? 
                {
                    ...message.media,
                    uploadType: false,
                    uri

                } as IMessageMedia
                :
                null;
                return { ...message,media};
            }
        ) as IFeedMessage[];
    }
);

export default loadFeedThunk;