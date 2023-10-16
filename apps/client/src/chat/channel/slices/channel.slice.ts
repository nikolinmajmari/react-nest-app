import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IChannel, IChannelMember, IDeepResolveChannel } from "@mdm/mdm-core";
import { channels } from "../../../api.client/client";
import { IAsyncState } from "../../../core/async.state";

export interface  IChannelState extends IAsyncState  {
    channel: IDeepResolveChannel|null,
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
        })
        .addCase(deleteMemberThunk.fulfilled,(state,action)=>{
            if(state.channel){
                state.channel.members = state.channel?.members.filter((m)=>m.id===action.payload.id);
            }
            state.status = "succeeded";
        })
        .addCase(deleteMemberThunk.pending,(state,action)=>{
            state.status = 'mutating';
        })
        .addCase(deleteMemberThunk.rejected,(state,action)=>{
            state.status = "failed";
            state.error = action.error;
        })
        ;
        return builder;
    },
});


export const loadChannelThunk = createAsyncThunk<IDeepResolveChannel,string>(
    "chat_channel_id",async (channelId:string,thunkapi)=>{
        return (await channels.getChannel(channelId));
    }
);

export const deleteMemberThunk = createAsyncThunk<IChannelMember,IChannelMember>(
    'chat_channel_members_delete',async (member:IChannelMember)=>{
        await channels.deleteMember(member.id);
        return member;
    }
)


export  const {setChannel} = channelSlice.actions;
export default channelSlice.reducer;