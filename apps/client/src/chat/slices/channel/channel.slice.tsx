import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IChannelMessage, IChannelState } from "./channel.model";


const initialState:IChannelState  = {
    error:null,
    messages:[],
    id:null,
    status:"idle"
}

const channelSlice = createSlice({
    initialState,
    name:"chat/channels/messages",
    reducers:{
        markMessageSent(state,action){
            const index = state.messages.findIndex(
                (message)=>message.token===action.payload
            );
            state.messages[index].status = "sent";
        },
        markMessageFailed(state,action){
            const index = state.messages.findIndex(
                (message)=>message.token===action.payload
            );
            state.messages[index].status = "failed";
        },
        addMessage(state,action){
            state.messages.push(
                {
                    ...action.payload,
                    status: "pending"
                }
            );
        },
        setChannel(state,action){
            state.id = action.payload;
        }

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
        ;
        return builder;
    },
});


const loadMessagesThunk = createAsyncThunk<IChannelMessage[],number>(
    "/channels/messages/paginate",async (channel,thunkapi)=>{
        return new Promise((resolve,reject)=>{
            return setTimeout(function(){
                resolve([
                   1,2,3,4,5,6,7,8,9,10
                ].map(function(id){
                    return  {
                        id:id,
                        content: channel+"Lorem Lipsum solem tolorem lorem dorem tom lorem nip soptem lom norem boehem",
                        sender: 112,
                        status: "sent",
                    };
                }))
            },100);
        })
    }
);


export  const {addMessage,markMessageFailed,markMessageSent,setChannel} = channelSlice.actions;
export {loadMessagesThunk};
export default channelSlice.reducer;