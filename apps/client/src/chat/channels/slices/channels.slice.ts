import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ChannelType, IChannel } from "@mdm/mdm-core";
import { channels } from "../../../api.client/client";
import { IAsyncState } from "../../../core/async.state";

export interface IChannelsState extends IAsyncState{
    channels:IChannel[],
    activeChannel:string|null
}

const initialState:IChannelsState = {
    status: "idle",
    channels: [],
    activeChannel: null,
    error: null
}

const slice = createSlice({
    initialState:initialState,
    name: "channels",
    reducers:{
        setActiveChannel(state,action){
            state.activeChannel = action.payload;
        }
    },
    extraReducers(builder){
        builder
            .addCase(loadChannelsThunk.fulfilled,(state,action)=>{
                state.status = "succeeded";
                state.channels = action.payload;
            })
            .addCase(loadChannelsThunk.pending,(state,action)=>{
                state.status = "loading";
            })
            .addCase(loadChannelsThunk.rejected,(state,action)=>{
                state.status = "failed";
                state.error = action.payload;
            })
            .addCase(createPrivateChannelThunk.fulfilled,(state,action)=>{
                state.status = "succeeded";
                state.channels.unshift(action.payload);
            })
            return builder;
        }
});


//// thunks 

export const loadChannelsThunk = createAsyncThunk<IChannel[],void>("channels/load",async (arg,thunkApi)=>{
        return await channels.get();
    }
);

export const createPrivateChannelThunk = createAsyncThunk<IChannel,Partial<IChannel>>('channels/create',async (data,thunkApi)=>{
    const channel =  await channels.createChannel({
        ...data,
        type: ChannelType.private
    });
    return await channels.getChannel((channel as any).id);
});

//// actions 
export const {setActiveChannel}  = slice.actions;


//// reducer
export default slice.reducer;
