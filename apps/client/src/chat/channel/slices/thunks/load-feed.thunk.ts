import {createAsyncThunk} from "@reduxjs/toolkit";
import {channels} from "../../../../api.client/client";
import {IMessage, PaginationResponse} from "@mdm/mdm-core";

const loadFeedThunk = createAsyncThunk<PaginationResponse<IMessage>, {channelId:string,skip:number,take:number}>(
  "/channels/messages/paginate", async function ({channelId,skip,take}) {
    return channels.getChannelMessagesPaginate(channelId,skip,take);
  }
);


export default loadFeedThunk;
