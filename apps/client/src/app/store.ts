import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../auth/auth.slice'
import channelsReducer from '../chat/channels/slices/channels.slice';
import channelMessagesReducer from '../chat/channel/slices/channel-messages.slice';
import channelReducer from '../chat/channel/slices/channel.slice';
// ...
const store = configureStore({
  reducer: {
    auth: authReducer,
    channels: channelsReducer,
    channelMessages: channelMessagesReducer,
    channel: channelReducer
  },
})
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;
export default store