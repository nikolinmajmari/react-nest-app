import {createAsyncThunk} from "@reduxjs/toolkit";
import {channels} from "../../../../api.client/client";
import {IMessage, PaginationResponse} from "@mdm/mdm-core";

const loadFeedThunk = createAsyncThunk<PaginationResponse<IMessage>, {channelId:string,skip:number,take:number}>(
  "/channels/messages/paginate", async function ({channelId,skip,take}) {
    return channels.getChannelMessagesPaginate(channelId,skip,take);
  }
);

function delayed<T>(promise:Promise<T>) {
  return new Promise<T>((resolve, reject)=>{
    setTimeout(
      async ()=>resolve(await promise),
      10000
    )
  })
}


export default loadFeedThunk;
