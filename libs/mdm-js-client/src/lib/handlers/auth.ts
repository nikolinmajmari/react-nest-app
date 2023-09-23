import { BaseClient } from "../base-client";
import { IUser } from "@mdm/mdm-core";

export class AuthHandler{
    constructor(
        private readonly baseClient:BaseClient
    ){}

    async login(credentials:ICredential):Promise<IAuthLoginResult>{
        return await this.baseClient.post('/auth/login',credentials);
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