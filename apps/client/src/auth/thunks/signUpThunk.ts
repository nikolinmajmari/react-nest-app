import { ActionReducerMapBuilder, createAsyncThunk } from "@reduxjs/toolkit";
import { IAuthState, SignUpUserInfo, SuccessfullLoginResult } from "../auth.model";


const signUpThunk = createAsyncThunk<SuccessfullLoginResult,SignUpUserInfo>(
    "auth/signup",async (credentials:SignUpUserInfo,thunkApi)=>{
        return ({
            refreshToken: "refresh-token",
            token:"this is a token",
            user: {
                email: "user@email.com",
                firstName: "FirstName",
                lastName: "LastName",
                id: 32
            }
        } as SuccessfullLoginResult);
    }
);

export function registerSignUpThunk(builder: ActionReducerMapBuilder<IAuthState>){
    builder
    .addCase(signUpThunk.fulfilled,(state,action)=>{
        state.status = "succeeded";
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
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