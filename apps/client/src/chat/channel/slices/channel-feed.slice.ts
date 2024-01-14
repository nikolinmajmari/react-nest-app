/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {
  IChannelMessagesState,
  IFeedMessage,
  IFeedMessageSlug,
  IMessageStartMediaProgressPayload,
  IMessageUploadMediaProgressPayload,
  MediaStatus,
  MessageStatus
} from "./channel-feed.model";
import loadFeedThunk from "./thunks/load-feed.thunk";
import postMessageThunk from "./thunks/post-message.thunk";
import deleteMessagesThunk from "./thunks/delete-messages.thunk";


const initialState: IChannelMessagesState = {
  error: null,
  messages: [],
  hasMore:true,
  status: "idle"
}

const channelFeedSlice = createSlice({
  initialState,
  name: "chat_channels_id_messages",
  reducers: {
    /// media reducers
    startMediaProgress(state, action: PayloadAction<IMessageStartMediaProgressPayload>) {
      const index = state.messages.findIndex(
        m => m.slug === action.payload.slug
      );
      state.messages[index].media!.operation = {
        requestKey:action.payload.requestKey,
        progress: 0.1
      };
      state.messages[index].media!.uploadType = true;
    },
    restartMediaProgress(state, action: PayloadAction<IFeedMessageSlug>) {
      const index = state.messages.findIndex(m => m.slug === action.payload.slug);
      state.messages[index].media!.operation!.progress=0.1;
      state.messages[index].media!.uploadType = true;
    },
    abortMediaProgress(state, action:PayloadAction<IFeedMessageSlug>) {
      const index = state.messages.findIndex(
        (m) => m.slug===action.payload.slug
      );
      state.messages[index].media!.operation!.progress = 0;
    },
    updateMediaProgress(state, action: PayloadAction<IMessageUploadMediaProgressPayload>) {
      const index =
        state.messages.findIndex(
          m =>m?.media?.operation && m.slug === action.payload.slug
        );
      state.messages[index].media!.operation!.progress = action.payload.progress;
    },
    completeMediaProgress(state, action: PayloadAction<IFeedMessageSlug>) {
      const index = state.messages.findIndex(m => m.slug === action.payload.slug);
      state.messages[index].media!.status = MediaStatus.succeded;
      state.messages[index].media!.operation = undefined;
    },

    /// message reducers
    addMessage(state, action: PayloadAction<IFeedMessage>) {
      const idIndex = state.messages.findIndex(m=>m.id===action.payload.id);
      const payload = {
        status: MessageStatus.pending,
        ...action.payload,
        content: action.payload.content??"",
      };
      if(idIndex!==-1){
        state.messages[idIndex] = {
          ...state.messages[idIndex],
          ...payload,
        };
      }else{
        state.messages.push(payload);
      }
    },
  },
  extraReducers(builder) {
    ///
    builder
      .addCase(loadFeedThunk.rejected, (state, action) => {
        if (action.payload) {
          state.status = "failed";
          state.error = action.payload;
        }
      })
      .addCase(loadFeedThunk.pending, (state, action) => {
        if(state.status=="idle"){
          state.status = "loading";
        }
      })
      .addCase(loadFeedThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.messages = [
          ...action.payload.data,
          ...state.messages.slice(0,action.payload.meta.skip),
        ];
        state.hasMore = action.payload.data.length == action.payload.meta.take;
      })
      /// post message thunk
      .addCase(postMessageThunk.fulfilled, (state, action) => {
        let index = state.messages.findIndex(
          (m: IFeedMessage) => m.slug === action.meta.arg.slug || m.id === action.payload.id
        );
        index = index===-1 ? state.messages.length : index;
        state.messages[index] = {
          ...(state.messages[index]||{}),
          ...action.payload
        }
      })
      .addCase(postMessageThunk.pending, (state, action) => {
        const {slug, message} = action.meta.arg;
        let index = state.messages.findIndex(
          (m: IFeedMessage) => m.slug === action.meta.arg.slug
        );
        index = index ===-1 ? state.messages.length : index;
        state.messages[index] = {
          ...(state.messages[index]||{}),
          slug: slug,
          ...message,
          status: MessageStatus.pending,
        } as IFeedMessage;
      })
      .addCase(postMessageThunk.rejected, (state, action) => {
        console.log('rejecting promise');
        const index = state.messages.findIndex(
          (m: IFeedMessage) => m.slug !== action.meta.arg.slug
        );
        if (index !== -1) {
          state.messages[index].status = MessageStatus.failed;
        }
      })

      /// delete messages thunk
      .addCase(deleteMessagesThunk.fulfilled,(state,action)=>{
        state.status = "succeeded";
      })
      .addCase(deleteMessagesThunk.pending,(state,action)=>{
        action.meta.arg.messagesId.forEach(function (messageId){
          const index = state.messages.findIndex(m=>m.id===messageId);
          if(index!==-1){
            state.messages[index].deleting = true;
          }
        });
        state.status = "mutating";
      })
      .addCase(deleteMessagesThunk.rejected,(state,action)=>{
        action.meta.arg.messagesId.forEach(function (messageId){
          const index = state.messages.findIndex(m=>m.id===messageId);
          if(index!==-1){
            delete state.messages[index].deleting;
          }
        });
        state.status = "succeeded";
      });
    return builder;
  },
});

export const {
  addMessage,
  completeMediaProgress,
  abortMediaProgress,
  restartMediaProgress,
  startMediaProgress,
  updateMediaProgress,
} = channelFeedSlice.actions;
export {loadFeedThunk, postMessageThunk,deleteMessagesThunk};
export default channelFeedSlice.reducer;
