import { IAsyncState } from "../core/async.state";

export interface LoginCredentials{
    email?:string,
    password?:string,
    idToken?:string,
}


export interface SignUpUserInfo{
    email:string,
    password:string,
    firstName:string,
    lastName:string
}


export interface AuthUser{
    id:number,
    email:string,
    firstName:string,
    lastName:string
}

export interface SuccessfullLoginResult{
    user:AuthUser,
    accessToken:string,
    refreshToken:string
}

export interface IAuthState extends IAsyncState{
  status: 'idle' | 'loading' | 'succeeded' | 'failed',
  error: any | null,
  user: any|null,
  token: string|null,
  accessToken: string|null,
  tokenTimeout: Date|null;
  refreshToken: string|null;
}
