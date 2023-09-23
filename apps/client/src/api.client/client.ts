import { AuthHandler, BaseClient, ChannelsHandler, UsersHandler } from "@mdm/mdm-js-client";
import axios from "axios";
import storage from "../core/storage";


const instance = axios.create({
    baseURL: "http://127.0.0.1:3000/api",
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