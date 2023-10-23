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
  denyAccessUnlessAuthorized(action: IAction, subject: T, user: IUser):Promise<void>;
}


export abstract class Authorizer<T> implements IAuthorizer<T>{
  async denyAccessUnlessAuthorized(action: IAction, subject: T, user: IUser):Promise<void>{
    if(!await this.isAuthorized(action,subject,user)){
      throw new UnauthorizedException();
    }
  }

  protected abstract isAuthorized(action: IAction, subject: T, user: IUser): Promise<boolean>;
}
