import { ActionReducerMapBuilder, createAsyncThunk } from "@reduxjs/toolkit";
import { IAuthState, LoginCredentials, SuccessfullLoginResult } from "../auth.model";
import storage from "../../core/storage";


const loginThunk = createAsyncThunk<SuccessfullLoginResult,LoginCredentials>(
    "auth/login",async (credentials:LoginCredentials,thunkApi)=>{
        return new Promise((resolve,reject)=>{
            setTimeout(()=>resolve({
            refreshToken: "refresh-token",
            token:"this is a token",
            user: {
                email: "user@email.com",
                firstName: "FirstName",
                lastName: "LastName",
                id: 32
            }
        } as SuccessfullLoginResult),350)
        });
    }
);

export function registerLoginThunk(builder: ActionReducerMapBuilder<IAuthState>){
    builder
    .addCase(loginThunk.fulfilled,(state,action)=>{
        state.status = "succeeded";
        state.user = action.payload.user;
        state.token = action.payload.token;
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