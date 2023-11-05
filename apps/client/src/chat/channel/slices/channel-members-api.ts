import {createApi} from "@reduxjs/toolkit/query/react";
import {fetchBaseQuery} from "@reduxjs/toolkit/dist/query/react";
import {ServerEndpoint} from "../../../api.client/client";
import storage from "../../../core/storage";
import {EndpointBuilder} from "@reduxjs/toolkit/dist/query/endpointDefinitions";
import {IChannelMember} from "@mdm/mdm-core";
import {BaseQueryArg} from "@reduxjs/toolkit/dist/query/baseQueryTypes";

export interface IChannelMembersQueryArgs{
  channel:string;
}

export interface IChannelMemberCreateArgs{

}

export interface IChannelMemberRemoveArgs{
  channel:string;
  member:string;
}


export const channelMembersApi = createApi({
  reducerPath:'channelMembersApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${ServerEndpoint}/api/channels`,
    prepareHeaders(headers,api){
      const auth = storage.getAuthData();
      if(!auth.accessToken){
        console.warn('token was not found');
      }
      headers.set('Authorization',`Bearer ${auth.accessToken}`);
      return headers;
    }
  }),
  tagTypes:["ChannelMembers"],
  endpoints:(builder)=>({
    getChannelMembers: builder.query<IChannelMember[],IChannelMembersQueryArgs>({
      query:(args)=>`/${args.channel}/members`,
      providesTags:["ChannelMembers"]
    }),
    removeChannelMember: builder.mutation<unknown,IChannelMemberRemoveArgs>({
      query:(arg)=>({
        url:`/${arg.channel}/members/${arg.member}`,
        method:'DELETE'
      }),
      invalidatesTags: [{type:"ChannelMembers",id:"LIST"},'ChannelMembers']
    })
  })
});

export const {
  useGetChannelMembersQuery,
  useRemoveChannelMemberMutation
} = channelMembersApi;
