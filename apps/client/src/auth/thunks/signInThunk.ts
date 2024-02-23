import { ActionReducerMapBuilder, createAsyncThunk } from "@reduxjs/toolkit";
import { IAuthState, LoginCredentials, SuccessfullLoginResult } from "../auth.model";
import storage from "../../core/storage";
import {auth} from "../../api.client/client";
import { IAuthLoginResult } from "@mdm/mdm-js-client";


const loginThunk = createAsyncThunk<IAuthLoginResult,LoginCredentials>(
    "auth/login",async (credentials:LoginCredentials,thunkApi)=>{
        try{
           if(credentials.email && credentials.password){
             return await auth.login({
               email: credentials.email,password: credentials.password
             });
           }
           if(credentials.idToken){
             return await auth.loginWithGoogle(credentials.idToken);
           }
           throw new Error('An error occured');
        }catch(e){
            alert(e);
            throw e;
        }
    }
);

export function registerLoginThunk(builder: ActionReducerMapBuilder<IAuthState>){
    builder
    .addCase(loginThunk.fulfilled,(state,action)=>{
        state.status = "succeeded";
        state.user = action.payload.user;
        state.token = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        //// store the data
        storage.setAuthData(action.payload);
    })
    .addCase(loginThunk.pending,(state,action)=>{
        state.status = "loading";
    })
    .addCase(loginThunk.rejected,(state,action)=>{
        state.status = "failed";
        state.error = action.payload;
    });
    return builder;
}


export default loginThunk;
