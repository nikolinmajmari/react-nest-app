import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import storage from "../../../core/storage";
import { IChannel, IMessage, INewMessage, IUser } from "@mdm/mdm-core";
import { channels } from "../../../api.client/client";
import { IAsyncState } from "../../../core/async.state";

export enum ClientMessageStatus{
    sent='sent',
    pending='pending',
    failed='failed'
}

export interface IClientMessage extends IMessage{
    slug?:string
    sentStatus?: ClientMessageStatus,
    progress?:number;
}


export interface IChannelMessagesState extends IAsyncState {
    messages:(IClientMessage)[];
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
            state.messages[index].sentStatus = ClientMessageStatus.sent;
        },
        markMessageFailed(state,action){
            const index = state.messages.findIndex(m=>m.slug===action.payload.slug);
            state.messages[index].sentStatus = ClientMessageStatus.failed;
        },
        addMessage(state,action){
            state.messages.push(
                { ...action.payload, sentStatus: ClientMessageStatus.pending }
            );
        },
        updateMessage(state,action){
            const index = state.messages.findIndex(m=>m.slug===action.payload.slug);
            if(index){
                state.messages[index] = {...state.messages[index],...action.payload};
            }
        },
        updateMediaUploadProgress(state,action){
            const index = state.messages.findIndex(m=>m.slug===action.payload.slug);
            if(index){
                state.messages[index] = {...state.messages[index],progress:action.payload.progress};
            }
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
                (m:INewMessage)=>m.slug !== action.meta.arg.key
            );
            state.messages = state.messages.splice(index,1);
            state.messages.push(action.payload);
        })
        .addCase(postMessageThunk.pending,(state,action)=>{
            state.messages.push({
                slug: action.meta.arg.key,
                ...action.meta.arg.message,
                sender: action.meta.arg.user,
                sentStatus: ClientMessageStatus.pending,
            } as IClientMessage);
        })
        .addCase(postMessageThunk.rejected,(state,action)=>{
            const index =  state.messages.findIndex(
                (m:INewMessage)=>m.slug !== action.meta.arg.key
            );
            state.messages[index].sentStatus = ClientMessageStatus.failed;
        })
        ;
        return builder;
    },
});


const loadFeedThunk = createAsyncThunk<IMessage[],string>(
    "/channels/messages/paginate",async (channelId,thunkapi)=>{
        return await channels.getChannelMessages(channelId);
    }
);
export interface IPostMessageArgs{
    user:Partial<IUser>
    channelId:string,
    message:Partial<IMessage>,
    key:string
}
export const postMessageThunk = createAsyncThunk<IMessage,IPostMessageArgs>(
    '/channels/messages/post', async (args,thunkapi)=>{
        const id = await channels.postChannelMessage(args.channelId,args.message);
        
        return new Promise((resolve,reject)=>{
            setTimeout(()=>reject(1),1000)
        })
        
        
        return {
            ...args.message,
            user: args.user,
            id,
            createdAt:new Date()
        } as IMessage;
    }
);


export  const {addMessage,updateMessage,markMessageFailed,markMessageSent} = channelFeedSlice.actions;
export {loadFeedThunk};
export default channelFeedSlice.reducer;