import { Json, Query } from "./types";

export interface IClient{

    get<T>(path:string,query:Query):Promise<T>;

    post<T>(path:string,body:Json|undefined):Promise<T>;

    put<T>(path:string,body:Json|undefined):Promise<T>;

    patch<T>(path:string,body:Json|undefined):Promise<T>;

    delete(path:string):Promise<void>;
}