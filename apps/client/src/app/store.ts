import {applyMiddleware, configureStore} from '@reduxjs/toolkit'
import authReducer from '../auth/auth.slice'
import channelsReducer from '../chat/channels/slices/channels.slice';
import channelFeed from '../chat/channel/slices/channel-feed.slice';
import channelReducer from '../chat/channel/slices/channel.slice';
import {channelMediaApi} from "../chat/channel/slices/channel-media.api";
import {channelMembersApi} from "../chat/channel/slices/channel-members-api";
// ...
const store = configureStore({
  reducer: {
    auth: authReducer,
    channels: channelsReducer,
    feed: channelFeed,
    channel: channelReducer,
    [channelMediaApi.reducerPath]:channelMediaApi.reducer,
    [channelMembersApi.reducerPath]:channelMembersApi.reducer,
  },
  middleware:(getDefaultMiddleware)=>{
    return getDefaultMiddleware()
        .concat(channelMediaApi.middleware)
        .concat(channelMembersApi.middleware)
  }
})
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;
export default store
