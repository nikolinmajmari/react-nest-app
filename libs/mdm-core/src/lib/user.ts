
export interface IUserEntity{
  id:string;
  firstName:string;
  lastName:string;
  email:string;
  password:string;
  avatar:string;
}


export type IUser = Pick<IUserEntity, "id"|"firstName"|"lastName"|"email"|"avatar">

export type IPartialUser = Partial<IUserEntity>;

export type ICreateUser = Omit<IUserEntity,"id">;
