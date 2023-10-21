import {IChannel, IChannelCreate, IMessage, IMessageCreate} from "@mdm/mdm-core";
import { BaseClient } from "../base-client";

export class ChannelsHandler{
    constructor(
        private readonly baseClient:BaseClient
    ){}

    async get():Promise<IChannel[]>{
        return await this.baseClient.get<IChannel[]>('/channels',{});
    }

    async createChannel(partial:IChannelCreate):Promise<string>{
        return await this.baseClient.post<string>(`/channels/`,partial);
    }

    async getChannel(id:string):Promise<IChannel>{
        return await this.baseClient.get<IChannel>(`/channels/${id}`,{});
    }

    async updateChannel(id:string,update:Omit<IChannel,'type'|'createdAt'|'messages'|'lastMessage'>){
        return await this.baseClient.patch<IChannel>(`/channels/${id}`,update);
    }

    async deleteChannel(id:string){
        return await this.baseClient.delete(`/channels/${id}`);
    }

    async getChannelMessages(id:string){
        return await this.baseClient.get<IMessage[]>(`/channels/${id}/messages`,{});
    }

    async postChannelMessage(id:string,message:IMessageCreate){
        return await this.baseClient.post<string>(`/channels/${id}/messages`,message);
    }

    async deleteMember(id:string){
        return await this.baseClient.delete(`/members/${id}`);
    }
}
