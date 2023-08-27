import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../auth/auth.slice'
import channelsReducer from '../chat/slices/channels/channels.slice';
import channelReducer from '../chat/slices/channel/channel.slice';
// ...
const store = configureStore({
  reducer: {
    auth: authReducer,
    channels: channelsReducer,
    channel: channelReducer
  },
})
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;
export default store