import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../auth/auth.slice'
import channelsReducer from '../chat/channels/slices/channels.slice';
import channelFeed from '../chat/channel/slices/channel-feed.slice';
import channelReducer from '../chat/channel/slices/channel.slice';
// ...
const store = configureStore({
  reducer: {
    auth: authReducer,
    channels: channelsReducer,
    feed: channelFeed,
    channel: channelReducer
  },
})
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;
export default store