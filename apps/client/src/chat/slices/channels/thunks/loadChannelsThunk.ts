import { ActionReducerMapBuilder, createAsyncThunk } from "@reduxjs/toolkit";
import { Channel, IChannelsState } from "../channels.model";


const loadChannelsThunk = createAsyncThunk<Channel[],void>("channels/load",(arg,thunkApi)=>{
    console.log("updating channels");
    return new Promise((resolve,reject)=>{
            setTimeout(()=>resolve([
                {
                    alias: "Lorem Lipsum",
                    id:1,
                    lastMessage: "Lorem nasil lor dorem",
                    lastSender: "LeyLasa",
                    memberNo: 2,
                    type: "direct"
                },
                {
                    alias: "Lorem Lipsum",
                    id:2,
                    lastMessage: "Lorem nasil lor dorem",
                    lastSender: "LeyLasa",
                    memberNo: 2,
                    type: "direct"
                },
                {
                     alias: "Lorem Lipsum",
                    id:3,
                    lastMessage: "Lorem nasil lor dorem",
                    lastSender: "LeyLasa",
                    memberNo: 2,
                    type: "direct"
                },
                {
                     alias: "Lorem Lipsum",
                    id:4,
                    lastMessage: "Lorem nasil lor dorem",
                    lastSender: "LeyLasa",
                    memberNo: 2,
                    type: "direct"
                }
            ]),850)
    });
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