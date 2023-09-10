import { ActionReducerMapBuilder, createAsyncThunk } from "@reduxjs/toolkit";
import { Channel, IChannelsState } from "../channels.model";
import storage from "../../../../core/storage";


const loadChannelsThunk = createAsyncThunk<Channel[],void>("channels/load",async (arg,thunkApi)=>{
     const token = storage.getAuthData().accessToken;
        const response = await fetch("http://127.0.0.1:3000/api/channels",{
            method:'get',
            headers:{
                'Content-Type':'application/json',
                'Authorization':`Bearer ${token}`
            }
        });
        return await response.json();
}
);

export function registerLoadChannelsThunk(builder: ActionReducerMapBuilder<IChannelsState>){
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
    });
    return builder;
}


export default loadChannelsThunk;