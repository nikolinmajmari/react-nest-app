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

const initialState: IChannelMessagesState = {
  error: null,
  messages: [],
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
      state.messages.push(
        {
          ...action.payload,
          status: MessageStatus.pending,
          content: action.payload.content??"",
        }
      );
    },
  },
  extraReducers(builder) {
    builder
      .addCase(loadFeedThunk.rejected, (state, action) => {
        if (action.payload) {
          state.status = "failed";
          state.error = action.payload;
        }
      })
      .addCase(loadFeedThunk.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(loadFeedThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.messages = action.payload;
      })
      .addCase(postMessageThunk.fulfilled, (state, action) => {
        const index = state.messages.findIndex(
          (m: IFeedMessage) => m.slug === action.meta.arg.slug
        );
        if (index !== -1) {
          state.messages[index] = {
            ...state.messages[index],
            ...action.payload
          }
        } else {
          state.messages.push(action.payload);
        }
      })
      .addCase(postMessageThunk.pending, (state, action) => {
        const {slug, message, user} = action.meta.arg;
        const index = state.messages.findIndex(s => slug === s.slug);
        if (index === -1) {
          state.messages = [
            ...state.messages,
            {
              slug: slug,
              ...message,
              sender: user,
              sentStatus: MediaStatus.pending,
            } as unknown as IFeedMessage
          ];
        } else {
          state.messages[index].status = MessageStatus.pending;
        }
      })
      .addCase(postMessageThunk.rejected, (state, action) => {
        const index = state.messages.findIndex(
          (m: IFeedMessage) => m.slug !== action.meta.arg.slug
        );
        if (index !== -1) {
          state.messages[index].status = MessageStatus.failed;
        }
      })
    ;
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
} = channelFeedSlice.actions;
export {loadFeedThunk, postMessageThunk};
export default channelFeedSlice.reducer;
