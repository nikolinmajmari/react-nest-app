import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../auth/auth.slice'
import channelsReducer from '../chat/slices/channels/channels.slice';
// ...
const store = configureStore({
  reducer: {
    auth: authReducer,
    channels: channelsReducer
  },
})
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;
export default store