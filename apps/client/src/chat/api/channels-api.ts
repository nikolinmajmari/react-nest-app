import {createApi} from "@reduxjs/toolkit/query/react";
import channelBaseQuery from "./channel-base-query";
export interface IChannelMemberRemoveArgs{
  channel:string;
  member:string;
}

export const channelsApi = createApi({
  reducerPath:'channelsApi',
  baseQuery:channelBaseQuery,
  tagTypes:['Channel','Media','Messages'],
  endpoints:(builder)=>({})
});
