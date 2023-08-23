import { createSlice } from "@reduxjs/toolkit";
import { IAsyncState } from "../core/async.state";
import { IAuthState } from "./auth.model";
import { registerLoginThunk } from "./thunks/signInThunk";
import { registerSignUpThunk } from "./thunks/signUpThunk";

const initialState:IAuthState = {
    status: "idle",
    error: null,
    tokenTimeout: null,
    user:null,
    refreshToken: null,
    token: null
}

const slice = createSlice({
    initialState:initialState,
    name: "auth",
    reducers:{

    },
    extraReducers(builder){
        registerLoginThunk(builder);
        registerSignUpThunk(builder);
        return builder;
    }
})


export default slice.reducer;

