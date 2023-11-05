import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import {BaseQueryArg} from "@reduxjs/toolkit/dist/query/baseQueryTypes";
import {ServerEndpoint} from "../../../api.client/client";
import {IMedia} from "@mdm/mdm-core";
import storage from "../../../core/storage";

// Define a service using a base URL and expected endpoints
export interface IMediaQueryArgs{
    channel:string;
}
export const channelMediaApi = createApi({
    reducerPath: 'channelMediaApi',
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
    tagTypes:["Media"],
    endpoints: (builder) => ({
        getMediaGallery: builder.query<IMedia[], IMediaQueryArgs>({
            query: ({channel}) => `/${channel}/media?category=gallery`,
        }),
        getMediaDocs: builder.query<IMedia[], IMediaQueryArgs>({
            query: ({channel}) => `/${channel}/media?category=docs`,
        }),
    }),
});


export const {
    useGetMediaGalleryQuery,
    useGetMediaDocsQuery,
} = channelMediaApi;
