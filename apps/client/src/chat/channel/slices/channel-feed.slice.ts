/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IChannelMessagesState, IFeedMessageSlug, IMessageUploadMediaProgressPayload, IFeedMessageCreate, MediaStatus, MessageStatus, IFeedMessage } from "./channel-feed.model";
import loadFeedThunk from "./thunks/loadFeedThunk";
import postMessageThunk from "./thunks/postMessageThunk";

const initialState:IChannelMessagesState = {
    error:null,
    messages:[],
    status:"idle"
}

const channelFeedSlice = createSlice({
    initialState,
    name:"chat_channels_id_messages",
    reducers:{
        markMessageSent(state,action){
            const index = state.messages.findIndex(m=>m.slug===action.payload.slug);
            state.messages[index].createdAt =  new Date();
            state.messages[index].status = MessageStatus.sent;
        },
        failMediaProgress(state,action){
            const index = state.messages.findIndex(m=>m.slug===action.payload.slug);
            state.messages[index].status = MessageStatus.failed;
        },
        updateMediaProgress(state,action:PayloadAction<IMessageUploadMediaProgressPayload>){
            const index = state.messages.findIndex(m=>m.slug===action.payload.slug);
            state.messages[index].media!.status = MediaStatus.pending;
            state.messages[index].media!.progress = action.payload.progress;
        },
        startMediaProgress(state,action:PayloadAction<IFeedMessageSlug>){
            const index = state.messages.findIndex(m=>m.slug===action.payload.slug);
            state.messages[index].media!.status = MediaStatus.pending;
            state.messages[index].media!.progress = 0;
        },
        completeMediaProgress(state,action:PayloadAction<IFeedMessageSlug>){
            const index = state.messages.findIndex(m=>m.slug===action.payload.slug);
            state.messages[index].media!.status= MediaStatus.sucedded;
            state.messages[index].media!.progress = 1;
        },
        addMessage(state,action:PayloadAction<Partial<IFeedMessage>>){
            state.messages.push(
                { ...action.payload, 
                    status: MessageStatus.pending,
                    content: action.payload.content??"",
                }
            );
        },
    },
    extraReducers(builder) {
        builder
        .addCase(loadFeedThunk.rejected,(state,action)=>{
            if(action.payload){
                state.status = "failed";
                state.error = action.payload;
            }
        })
        .addCase(loadFeedThunk.pending,(state,action)=>{
            state.status = "loading";
        })
        .addCase(loadFeedThunk.fulfilled,(state,action)=>{
            state.status = "succeeded";
            state.messages = action.payload;
        })
        .addCase(postMessageThunk.fulfilled,(state,action)=>{
            const index =  state.messages.findIndex(
                (m:IFeedMessage)=>m.slug !== action.meta.arg.slug
            );
            state.messages = state.messages.splice(index,1);
            state.messages.push(action.payload);
        })
        .addCase(postMessageThunk.pending,(state,action)=>{
            const index = state.messages.findIndex(s=>action.meta.arg.slug===s.slug);
            if(!index){
                state.messages.push({
                slug: action.meta.arg.slug,
                ...action.meta.arg.message,
                sender: action.meta.arg.user,
                sentStatus: MediaStatus.pending,
            } as IFeedMessage);
            }
            state.messages[index].status = MessageStatus.pending;
        })
        .addCase(postMessageThunk.rejected,(state,action)=>{
            const index =  state.messages.findIndex(
                (m:IFeedMessage)=>m.slug !== action.meta.arg.slug
            );
            state.messages[index].status = MessageStatus.failed;
        })
        ;
        return builder;
    },
});

export  const {addMessage,completeMediaProgress,failMediaProgress,markMessageSent,startMediaProgress,updateMediaProgress,} = channelFeedSlice.actions;
export {loadFeedThunk,postMessageThunk};
export default channelFeedSlice.reducer;