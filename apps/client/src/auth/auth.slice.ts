import { createSlice } from "@reduxjs/toolkit";
import { IAsyncState } from "../core/async.state";
import { IAuthState } from "./auth.model";
import { registerLoginThunk } from "./thunks/signInThunk";
import { registerSignUpThunk } from "./thunks/signUpThunk";
import storage from "../core/storage";

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
        attemptSilentSignIn(state){
            const data = storage.getAuthData();
            if(data){
                state.status = "succeeded";
                state.user = data.user;
                state.token = data.token;
                state.refreshToken = data.refreshToken;
            }else{
              state.status = 'failed';
            }
        },
        logOut(state){
            state.status = "idle";
            state.error = null;
            state.user = null;
            state.token = null;
            storage.clearAuthData();
        }
    },
    extraReducers(builder){
        registerLoginThunk(builder);
        registerSignUpThunk(builder);
        return builder;
    }
})


export const {attemptSilentSignIn,logOut} = slice.actions;

export default slice.reducer;

