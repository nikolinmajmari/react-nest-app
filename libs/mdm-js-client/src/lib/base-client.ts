import { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { IClient } from "./client";
import { Query, Json } from "./types";
import { HttpError } from "./errors/error";

export class BaseClient implements IClient{

    constructor(
        private readonly client:AxiosInstance
    ){}
    head<T = any, R = AxiosResponse<T, any>, D = any>(url: string, config?: AxiosRequestConfig<D> | undefined): Promise<R> {
        throw new Error("Method not implemented.");
    }
    options<T = any, R = AxiosResponse<T, any>, D = any>(url: string, config?: AxiosRequestConfig<D> | undefined): Promise<R> {
        throw new Error("Method not implemented.");
    }
    postForm<T = any, R = AxiosResponse<T, any>, D = any>(url: string, data?: D | undefined, config?: AxiosRequestConfig<D> | undefined): Promise<R> {
        throw new Error("Method not implemented.");
    }
    putForm<T = any, R = AxiosResponse<T, any>, D = any>(url: string, data?: D | undefined, config?: AxiosRequestConfig<D> | undefined): Promise<R> {
        throw new Error("Method not implemented.");
    }
    patchForm<T = any, R = AxiosResponse<T, any>, D = any>(url: string, data?: D | undefined, config?: AxiosRequestConfig<D> | undefined): Promise<R> {
        throw new Error("Method not implemented.");
    }

    async get<T = any, D = any>(url: string,query:Query, config?: AxiosRequestConfig<D> | undefined): Promise<T> {
        try{
            const response = await this.client.get(url,{
                headers:{
                    'Content-Type':'application/json',
                },
                params:query,
                ...config??{}
            });
            return response.data as T;
        }catch(e){
           throw this.handleError(e);
        }
    }
    async post<T=any, D = Json|FormData|undefined>(url: string, body?: D | undefined, config?: AxiosRequestConfig<D> | undefined): Promise<T> {
     try{
            const response = await this.client.post(url,body,{
                ...config??{}
            });
            return response.data as T;
        }catch(e){
           throw this.handleError(e);
        }   
    }

    async put<T = any, D = any>(url: string, body?: D | undefined, config?: AxiosRequestConfig<D> | undefined): Promise<T> {
         try{
            const response = await this.client.put(url,body,{
                headers:{
                    'Content-Type':'application/json',
                },
                ...config??{}
            });
            return response.data as T;
        }catch(e){
           throw this.handleError(e);
        }
    }
    async patch<T = any, R = AxiosResponse<T, any>, D = any>(url: string, body?: D | undefined, config?: AxiosRequestConfig<D> | undefined): Promise<T> {
        try{
            const response = await this.client.patch(url,body,{
                headers:{
                    'Content-Type':'application/json',
                },
                ...config??{}
            });
            return response.data as T;
        }catch(e){
           throw this.handleError(e);
        }
    }
    async delete(url: string, config?: AxiosRequestConfig | undefined): Promise<void> {
        try{
            await this.client.delete(url,{
                headers:{
                    'Content-Type':'application/json',
                },
                ...config??{}
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