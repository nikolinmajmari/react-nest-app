/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {
  IChannelMessagesState, IFeedMediaMessageSlug,
  IFeedMessage, IFeedMessageMedia, IFeedMessageMediaSlug,
  IFeedMessageSlug, IMessageStartMediaProgressPayload,
  IMessageUploadMediaProgressPayload,
  MediaStatus,
  MessageStatus
} from "./channel-feed.model";
import loadFeedThunk from "./thunks/loadFeedThunk";
import postMessageThunk from "./thunks/postMessageThunk";
import deleteMessagesThunk from "./thunks/deleteMessagesThunk";


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
    markMessageSent(state, action) {
      const index = state.messages.findIndex(m => m.slug === action.payload.slug);
      state.messages[index].createdAt = new Date();
      state.messages[index].status = MessageStatus.sent;
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
    setHasNoMore(state,action){
      state.hasMore = false;
    },
    restartMediaProgress(state, action: PayloadAction<IFeedMessageSlug>) {
      const index = state.messages.findIndex(m => m.slug === action.payload.slug);
      state.messages[index].media!.operation!.progress=0.1;
      state.messages[index].media!.uploadType = true;
    },
    completeMediaProgress(state, action: PayloadAction<IFeedMessageSlug>) {
      const index = state.messages.findIndex(m => m.slug === action.payload.slug);
      state.messages[index].media!.status = MediaStatus.succeded;
      state.messages[index].media!.operation = undefined;
    },
    addMessage(state, action: PayloadAction<IFeedMessage>) {
      const idIndex = state.messages.findIndex(m=>m.id===action.payload.id);
      console.log('adding ',action.payload.id);
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
        console.log('fullfilling promise');
        const index = state.messages.findIndex(
          (m: IFeedMessage) => m.slug === action.meta.arg.slug
        );
        console.log(action);
        const idIndex = state.messages.findIndex(
          (m: IFeedMessage) => m.id === action.payload.id
        );
        console.log('posting message fullfilled',idIndex,state.messages,action.payload);
        if(idIndex!==-1){
          return;
        }
        if (index !== -1) {
          state.messages[index] = {
            ...state.messages[index],
            ...action.payload
          }
        }
      })
      .addCase(postMessageThunk.pending, (state, action) => {
        console.log('pending promise');
        const {slug, message} = action.meta.arg;
        const index = state.messages.findIndex(s => slug === s.slug);
        if (index === -1) {
          state.messages = [
            ...state.messages,
            {
              slug: slug,
              ...message,
              sentStatus: MediaStatus.pending,
            } as unknown as IFeedMessage
          ];
        } else {
          state.messages[index].status = MessageStatus.pending;
        }
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
  markMessageSent,
  restartMediaProgress,
  startMediaProgress,
  updateMediaProgress,
  setHasNoMore,
} = channelFeedSlice.actions;
export {loadFeedThunk, postMessageThunk,deleteMessagesThunk};
export default channelFeedSlice.reducer;
