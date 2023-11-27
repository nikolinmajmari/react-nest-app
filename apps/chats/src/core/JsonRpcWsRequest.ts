import {IsObject, IsOptional, IsString} from "@nestjs/class-validator";
import {ValidateNested,isString} from "@nestjs/class-validator";
import {Type} from "class-transformer";


export interface IJsonRpcWsRequest<T>{
  data:T;
  id?:string;
  params?:Record<string, string|number>;
}

export interface IJsonRpcWsResponse<R extends any,E extends any>{
  id?:string;
  result?:R;
  error?:E;
}
