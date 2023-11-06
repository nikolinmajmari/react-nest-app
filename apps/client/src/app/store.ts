import {applyMiddleware, configureStore} from '@reduxjs/toolkit'
import authReducer from '../auth/auth.slice'
import channelFeed from '../chat/channel/slices/channel-feed.slice';
import {channelMediaApi} from "../chat/channel/slices/channel-media.api";
import {channelsApi} from "../chat/api/channels-api";
// ...
const store = configureStore({
  reducer: {
    auth: authReducer,
    [channelMediaApi.reducerPath]:channelMediaApi.reducer,
    [channelsApi.reducerPath]:channelsApi.reducer,
    feed: channelFeed,
  },
  middleware:(getDefaultMiddleware)=>{
    return getDefaultMiddleware()
        .concat(channelMediaApi.middleware)
        .concat(channelsApi.middleware)
  }
})
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;
export default store
