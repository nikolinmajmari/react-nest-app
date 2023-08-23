import { createSlice } from "@reduxjs/toolkit";
import { IChannelsState } from "./channels.model";
import { registerLoadChannelsThunk } from "./thunks/loadChannelsThunk";

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
        registerLoadChannelsThunk(builder);
        return builder;
    }
})

export const {setActiveChannel}  = slice.actions;

export default slice.reducer;
