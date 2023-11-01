import { AuthHandler, BaseClient, ChannelsHandler, MediaHandler, UsersHandler } from "@mdm/mdm-js-client";
import axios from "axios";
import storage from "../core/storage";

export const ServerEndpoint = 'http://localhost:3000';

const instance = axios.create({
    baseURL: ServerEndpoint+"/api",
});

instance.interceptors.request.use((config)=>{
    if(storage.getAuthData()){
     config.headers['Authorization'] = `Bearer ${storage.getAuthData().accessToken}`;
     config.headers = config.headers??new Headers();
    }
    return config;
})

const client = new BaseClient(instance);

(window as any).client = client;

export default client;

export const auth = new AuthHandler(client);

export const channels = new ChannelsHandler(client);

export const users = new UsersHandler(client);

export const media = new MediaHandler(client);
