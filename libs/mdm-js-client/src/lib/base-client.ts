import { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import { IClient } from "./client";
import { Query, Json } from "./types";
import { HttpError } from "./errors/error";

export class BaseClient implements IClient{

    constructor(
        private readonly client:AxiosInstance
    ){}

    async get<T>(path: string, query: Query): Promise<T> {
        try{
            const response = await this.client.get(path,{
                headers:{
                    'Content-Type':'application/json',
                },
                method: 'GET',
                params:query
            });
            return response.data as T;
        }catch(e){
           throw this.handleError(e);
        }
    }
    async post<T>(path: string, body: Json | undefined|FormData,config:AxiosRequestConfig<any>|undefined=undefined): Promise<T> {
        try{
            const headers:Json = {};
            if(body instanceof FormData){
                headers['Content-Type'] = "multipart/form-data";
            }else{
                headers['Content-Type'] = 'application/json';
            }
            const response = await this.client.post(path,body,{
                headers:headers,
                ...config
            });
            return response.data as T;
        }catch(e){
           throw this.handleError(e);
        }
    }

    async put<T>(path: string, body: Json | undefined): Promise<T> {
        try{
            const response = await this.client.put(path,body,{
                headers:{
                    'Content-Type':'application/json',
                },
            });
            return response.data as T;
        }catch(e){
           throw this.handleError(e);
        }
    }
    async patch<T>(path: string, body: Json | undefined): Promise<T> {
        try{
            const response = await this.client.patch(path,body,{
                headers:{
                    'Content-Type':'application/json',
                },
            });
            return response.data as T;
        }catch(e){
           throw this.handleError(e);
        }
    }
    async delete(path: string): Promise<void> {
        try{
            await this.client.delete(path,{
                headers:{
                    'Content-Type':'application/json',
                },
            });
        }catch(e){
           throw this.handleError(e);
        }
    }

    private handleError(e:any):Error{
        console.log(e);
        if(e instanceof AxiosError){
            return new HttpError(e.response?.data?.message??e.message);
        }
        return new Error('an error occured');
    }

}