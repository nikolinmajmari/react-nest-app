import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {IChannel, IChannelCreate} from "@mdm/mdm-core";
import {channels} from "../../../api.client/client";
import {IAsyncState} from "../../../core/async.state";

export interface IChannelsState extends IAsyncState {
    channels: IChannel[],
    activeChannel: string | null
}

const initialState: IChannelsState = {
    status: "idle", channels: [], activeChannel: null, error: null
}

const slice = createSlice({
    initialState: initialState, name: "channels", reducers: {
        setActiveChannel(state, action) {
            state.activeChannel = action.payload;
        }
    }, extraReducers(builder) {
        builder
            .addCase(loadChannelsThunk.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.channels = action.payload;
            })
            .addCase(loadChannelsThunk.pending, (state, action) => {
                state.status = "loading";
            })
            .addCase(loadChannelsThunk.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })
            .addCase(createChannelThunk.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.channels.unshift(action.payload);
            })
            .addCase(deleteChannelThunk.pending, (state, action) => {
                state.status = "mutating";
            })
            .addCase(deleteChannelThunk.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.channels = state.channels.filter((i) => i.id !== action.payload);
            })
        return builder;
    }
});


//// thunks

export const loadChannelsThunk = createAsyncThunk<IChannel[], void>("channels/load", async (arg, thunkApi) => {
    return await channels.get();
});

export const createChannelThunk = createAsyncThunk<IChannel, IChannelCreate>('channels/create', async (data: IChannelCreate, thunkApi) => {
    const channel = await channels.createChannel({
        ...data
    });
    return await channels.getChannel((channel as any).id);
});

export const deleteChannelThunk = createAsyncThunk<string, Pick<IChannel, 'id'>>('channels/delete', async (data, thunkApi) => {
    await channels.deleteChannel(data.id!);
    return data.id!;
})

//// actions
export const {setActiveChannel} = slice.actions;


//// reducer
export default slice.reducer;
