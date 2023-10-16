
export interface IUser{
  id:string;
  firstName:string;
  lastName:string;
  email:string;
  password:string;
  avatar:string;
}


export type IPartialUser = Partial<IUser>;

export type ICreateUser = Omit<IUser,"id">;

export type IPublicUser = Omit<IUser,"password">;