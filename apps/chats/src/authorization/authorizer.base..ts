import {IUser} from "@mdm/mdm-core";
import {T} from "vitest/dist/types-198fd1d9";
import {UnauthorizedException} from "@nestjs/common";

export enum Action {
  Create = 'create', Update = 'update', View = 'view', Delete = 'delete'
}

export type IAction =
  "create"
  | Action.Create
  | "update"
  | Action.Update
  | 'view'
  | Action.View
  | 'delete'
  | Action.Delete;


export interface IAuthorizer<T>{
  authorize(action: IAction,user: IUser, subject: T,message?:string):Promise<void>;
}


export abstract class Authorizer<T> implements IAuthorizer<T>{
  async authorize(action: IAction, user: IUser,subject?: T,message="Access Denied"):Promise<void>{
    if(!await this.isAuthorized(action,user,subject)){
      throw new UnauthorizedException(
        {message:message,status:401}
      );
    }
  }

  abstract isAuthorized(action: IAction, user: IUser, subject?: T): Promise<boolean>;
}
