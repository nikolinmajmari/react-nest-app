import { IChannel, IMessage } from "@mdm/mdm-core";
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
}
