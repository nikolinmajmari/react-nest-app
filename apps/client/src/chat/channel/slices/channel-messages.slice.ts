import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import storage from "../../../core/storage";
import { IChannel, IMessage, IUser } from "@mdm/mdm-core";
import { channels } from "../../../api.client/client";
import { IAsyncState } from "../../../core/async.state";


export interface IChannelMessagesState extends IAsyncState {
    messages:IMessage[];
};

const initialState:IChannelMessagesState  = {
    error:null,
    messages:[],
    status:"idle"
}

const channelMessagesSlice = createSlice({
    initialState,
    name:"chat_channels_id_messages",
    reducers:{
        markMessageSent(state,action){
            // const index = state.messages.findIndex(
            //     (message)=>message.token===action.payload
            // );
            // state.messages[index].status = "sent";
        },
        markMessageFailed(state,action){
            // const index = state.messages.findIndex(
            //     (message)=>message.token===action.payload
            // );
            // state.messages[index].status = "failed";
        },
        addMessage(state,action){
            state.messages.push(
                {
                    ...action.payload,
                    status: "pending"
                }
            );
        },
    },
    extraReducers(builder) {
        builder
        .addCase(loadMessagesThunk.rejected,(state,action)=>{
            if(action.payload){
                state.status = "failed";
                state.error = action.payload;
            }
        })
        .addCase(loadMessagesThunk.pending,(state,action)=>{
            state.status = "loading";
        })
        .addCase(loadMessagesThunk.fulfilled,(state,action)=>{
            state.status = "succeeded";
            state.messages = action.payload;
        })
        .addCase(postMessageThunk.fulfilled,(state,action)=>{
            state.messages.pop();
            state.messages.push(action.payload);
        })
        .addCase(postMessageThunk.pending,(state,action)=>{
            state.messages.push({
                id:"sent",
                ...action.meta.arg.message,
                sender: action.meta.arg.user
            }as IMessage);
        })
        .addCase(postMessageThunk.rejected,(state,action)=>{
            state.messages.pop();
        })
        ;
        return builder;
    },
});


const loadMessagesThunk = createAsyncThunk<IMessage[],string>(
    "/channels/messages/paginate",async (channelId,thunkapi)=>{
        return await channels.getChannelMessages(channelId);
    }
);
export interface IPostMessageArgs{
    user:Partial<IUser>
    channelId:string,
    message:Partial<IMessage>
}
export const postMessageThunk = createAsyncThunk<IMessage,IPostMessageArgs>(
    '/channels/messages/post', async (args,thunkapi)=>{
        const id = await channels.postChannelMessage(args.channelId,args.message);
        return {
            ...args.message,
            user: args.user,
            id
        } as IMessage;
    }
);


export  const {addMessage,markMessageFailed,markMessageSent} = channelMessagesSlice.actions;
export {loadMessagesThunk};
export default channelMessagesSlice.reducer;