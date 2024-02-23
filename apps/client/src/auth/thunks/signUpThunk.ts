import { ActionReducerMapBuilder, createAsyncThunk } from "@reduxjs/toolkit";
import { IAuthState, SignUpUserInfo, SuccessfullLoginResult } from "../auth.model";
import {auth} from "../../api.client/client";
import storage from "../../core/storage";


const signUpThunk = createAsyncThunk<SuccessfullLoginResult,SignUpUserInfo>(
    "auth/signup",async (credentials:SignUpUserInfo,thunkApi)=>{
      await auth.signUp(credentials);
      return await auth.login(credentials) as unknown as SuccessfullLoginResult;
    }
);

export function registerSignUpThunk(builder: ActionReducerMapBuilder<IAuthState>){
    builder
    .addCase(signUpThunk.fulfilled,(state,action)=>{
        state.status = "succeeded";
        state.user = action.payload.user;
        state.token = action.payload.accessToken;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
      storage.setAuthData(action.payload);
    })
    .addCase(signUpThunk.pending,(state,action)=>{
        state.status = "loading";
    })
    .addCase(signUpThunk.rejected,(state,action)=>{
        state.status = "failed";
        state.error = action.payload;
    });
    return builder;
}


export default signUpThunk;
