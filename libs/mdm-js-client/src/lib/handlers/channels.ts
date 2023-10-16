import { IChannel, IChannelCreate, IDeepResolveChannel, IMessage } from "@mdm/mdm-core";
import { BaseClient } from "../base-client";

export class ChannelsHandler{
    constructor(
        private readonly baseClient:BaseClient
    ){}

    async get():Promise<IDeepResolveChannel[]>{
        return await this.baseClient.get<IDeepResolveChannel[]>('/channels',{});
    }

    async createChannel(partial:IChannelCreate):Promise<string>{
        return await this.baseClient.post<string>(`/channels/`,partial);
    }

    async getChannel(id:string):Promise<IDeepResolveChannel>{
        return await this.baseClient.get<IDeepResolveChannel>(`/channels/${id}`,{});
    }

    async updateChannel(id:string,update:Partial<IChannel>){
        return await this.baseClient.patch<IChannel>(`/channels/${id}`,update);
    }

    async deleteChannel(id:string){
        return await this.baseClient.delete(`/channels/${id}`);
    }

    async getChannelMessages<T>(id:string){
        return await this.baseClient.get<T[]>(`/channels/${id}/messages`,{});
    }

    async postChannelMessage(id:string,message:Partial<IMessage>){
        return await this.baseClient.post<string>(`/channels/${id}/messages`,message);
    }

    async deleteMember(id:string){
        return await this.baseClient.delete(`/members/${id}`);
    }
}
