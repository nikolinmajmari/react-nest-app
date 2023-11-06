
import {fetchBaseQuery} from "@reduxjs/toolkit/dist/query/react";
import {ServerEndpoint} from "../../api.client/client";
import storage from "../../core/storage";

const channelBaseQuery = fetchBaseQuery({
  baseUrl: `${ServerEndpoint}/api/channels`,
  prepareHeaders(headers,api){
    const auth = storage.getAuthData();
    if(!auth.accessToken){
      console.warn('token was not found');
    }
    headers.set('Authorization',`Bearer ${auth.accessToken}`);
    return headers;
  },
});

export default channelBaseQuery;
