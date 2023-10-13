import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import storage from "../../../core/storage";
import { IChannel, IMedia, IMessage, INewMessage, IUser } from "@mdm/mdm-core";
import { channels } from "../../../api.client/client";
import { IAsyncState } from "../../../core/async.state";

export enum ClientMessageStatus{
    sent='sent',
    pending='pending',
    failed='failed'
}

export enum SentStatus{
    sent="sent",
    pending="pending",
    failed="failed"
}

export interface IFeedMessageSlug{
    slug:string;
}

export interface IFeedMessage extends Partial<IMessage>{
    slug?:string
    status?: SentStatus,
    mediaStatus?:"failed"|"pending"|"succeded";
    progress?:number;
}

export interface IMediaFeedMessage extends Partial<IMessage>{
    slug:string;
    media:string;
}

export interface IMessageUploadMediaProgressPayload{
    slug:string;
    progress:number;
}

export interface IChannelMessagesState extends IAsyncState {
    messages:(IFeedMessage)[];
};

const initialState:IChannelMessagesState  = {
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
            state.messages[index].status = SentStatus.sent;
        },
        failMediaProgress(state,action){
            const index = state.messages.findIndex(m=>m.slug===action.payload.slug);
            state.messages[index].status = SentStatus.failed;
        },
        updateMediaProgress(state,action:PayloadAction<IMessageUploadMediaProgressPayload>){
            const index = state.messages.findIndex(m=>m.slug===action.payload.slug);
            state.messages[index].mediaStatus = "pending";
            state.messages[index].progress = action.payload.progress;
        },
        startMediaProgress(state,action:PayloadAction<IFeedMessageSlug>){
            const index = state.messages.findIndex(m=>m.slug===action.payload.slug);
            state.messages[index].mediaStatus = "pending";
            state.messages[index].progress = 0;
        },
        completeMediaProgress(state,action:PayloadAction<IFeedMessageSlug>){
            const index = state.messages.findIndex(m=>m.slug===action.payload.slug);
            state.messages[index].mediaStatus = "succeded";
            state.messages[index].progress = 1;
        },
        addMessage(state,action:PayloadAction<Partial<IMediaFeedMessage>>){
            state.messages.push(
                { ...action.payload, 
                    status: SentStatus.pending,
                    progress:0,
                    mediaStatus: "pending"
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
                sentStatus: ClientMessageStatus.pending,
            } as IFeedMessage);
            }
            state.messages[index].status = SentStatus.pending;
        })
        .addCase(postMessageThunk.rejected,(state,action)=>{
            const index =  state.messages.findIndex(
                (m:IFeedMessage)=>m.slug !== action.meta.arg.slug
            );
            state.messages[index].status = SentStatus.failed;
        })
        ;
        return builder;
    },
});


const loadFeedThunk = createAsyncThunk<Partial<IFeedMessage>[],string>(
    "/channels/messages/paginate",async function(channelId,thunkapi){
        return (await channels.getChannelMessages(channelId)).map(
            (im)=>{
                const media =  im.media ? `http://127.0.0.1:3000${(im.media as Partial<IMedia>).uri}`:null
                return {
                    ...im,
                    media
                };
            }
        );
    }
);
export interface IPostMessageArgs{
    slug:string;
    user:Partial<IUser>
    channelId:string,
    message:Partial<IMessage>,
}
export const postMessageThunk = createAsyncThunk<IMessage,IPostMessageArgs>(
    '/channels/messages/post', async (args,thunkapi)=>{
        const id = await channels.postChannelMessage(args.channelId,args.message);
        return {
            ...args.message,
            user: args.user,
            id,
            createdAt:new Date()
        } as IMessage;
    }
);


export  const {addMessage,completeMediaProgress,failMediaProgress,markMessageSent,startMediaProgress,updateMediaProgress,} = channelFeedSlice.actions;
export {loadFeedThunk};
export default channelFeedSlice.reducer;