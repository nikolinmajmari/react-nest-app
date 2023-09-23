import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IChannel } from "@mdm/mdm-core";
import { channels } from "../../../api.client/client";
import { IAsyncState } from "../../../core/async.state";

export interface  IChannelState extends IAsyncState  {
    channel: IChannel|undefined|null,
}

const initialState:IChannelState = {
    channel: null,
    error: null,
    status: "idle"
};

const channelSlice = createSlice({
    initialState,
    name:"chat/channels/:id",
    reducers:{
        setChannel(state,action){
            state.channel = action.payload;
        }
    },
    extraReducers(builder) {
        builder
        .addCase(loadChannelThunk.rejected,(state,action)=>{
            state.status = "failed";
            state.error = action.payload;
        })
        .addCase(loadChannelThunk.pending,(state,action)=>{
            state.status = "loading";
        })
        .addCase(loadChannelThunk.fulfilled,(state,action)=>{
            state.status = "succeeded";
            state.channel = action.payload;
        });
        return builder;
    },
});


export const loadChannelThunk = createAsyncThunk<IChannel,string>(
    "chat_channel_id",async (channelId:string,thunkapi)=>{
        return await channels.getChannel(channelId)
    }
);


export  const {setChannel} = channelSlice.actions;
export default channelSlice.reducer;