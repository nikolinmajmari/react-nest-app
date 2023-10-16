import { IMessage, IUser } from "@mdm/mdm-core";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { channels } from "../../../../api.client/client";
import { IFeedMessage } from "../channel-feed.model";

export interface IPostMessageArgs{
    slug:string;
    user:Partial<IUser>
    channelId:string,
    message:Partial<IMessage>,
}

const postMessageThunk = createAsyncThunk<IFeedMessage,IPostMessageArgs>(
    '/channels/messages/post', async (args,thunkapi)=>{
        const id = await channels.postChannelMessage(args.channelId,args.message);
        return {
            ...args.message,
            user: args.user,
            id,
            createdAt:new Date()
        } as IFeedMessage;
    }
);

export default postMessageThunk;
