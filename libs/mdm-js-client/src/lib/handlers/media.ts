import { IMedia } from "@mdm/mdm-core";
import { BaseClient } from "../base-client";
import { AxiosProgressEvent } from "axios";

export class MediaHandler{
    constructor(
        private readonly baseClient:BaseClient
    ){}


    upload(data:FormData,progressHandler:(e:AxiosProgressEvent)=>void){
        return this.baseClient.post(`/media`,data,{
            onUploadProgress: progressHandler
        });
    }

    get(id:string){
        return this.baseClient.get<IMedia>(`/media/${id}`,{});
    }
}
