import { BaseClient } from "../base-client";
import { IUser } from "@mdm/mdm-core";

export class AuthHandler{
    constructor(
        private readonly baseClient:BaseClient
    ){}

    async login(credentials:ICredential):Promise<IAuthLoginResult>{
        return await this.baseClient.post('/auth/login',credentials);
    }

    async loginWithGoogle(idToken:string):Promise<IAuthLoginResult>{
      return await this.baseClient.post('/auth/google',null,{
        headers:{
          'google-oauth-id-token':idToken
        }
      })
    }
    async signUp(data:any):Promise<IAuthLoginResult>{
      return await this.baseClient.post('/users',data);
    }
}


interface ICredential{
    email:string;
    password:string;
}

export interface IAuthLoginResult{
    accessToken:string;
    refreshToken:string;
    user:IUser;
}
