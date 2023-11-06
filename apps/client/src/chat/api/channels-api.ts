import {createApi} from "@reduxjs/toolkit/query/react";
import channelBaseQuery from "./channel-base-query";
import {IChannel, IChannelCreate} from "@mdm/mdm-core";
import {channelApi, IChannelMemberRemoveArgs} from "../channel/slices/channel-api";

export interface IChannelMemberRemoveArgs{
  channel:string;
  member:string;
}

export const channelsApi = createApi({
  reducerPath:'channelsApi',
  baseQuery:channelBaseQuery,
  tagTypes:['Channel'],
  endpoints:(builder)=>({})
});
