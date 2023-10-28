import { IMedia } from "@mdm/mdm-core";
import { BaseClient } from "../base-client";
import {AxiosProgressEvent, AxiosRequestConfig} from "axios";
import RequestStorage from "../storage/request.storage.";
import {AbstractRepository} from "../storage/abstract.repository";

export class MediaHandler extends AbstractRepository{
    constructor(
        private readonly baseClient:BaseClient
    ){
      super();
    }

    public cache = new RequestStorage();

    upload(data:FormData){
        return this.replyable<IMedia>(
          (config)=>{
            return this.baseClient.post<IMedia>(`/media`,data,{
              ...config
            });
          }
        )
    }

    get(id:string){
        return this.baseClient.get<IMedia>(`/media/${id}`,{});
    }
}

