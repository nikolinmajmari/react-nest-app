import { AuthHandler, BaseClient } from "@mdm/mdm-js-client";
import axios from "axios";


const instance = axios.create({
    baseURL: "http://127.0.0.1:3000/api",
});

const client = new BaseClient(instance);

(window as any).client = client;

export default client;

export const auth = new AuthHandler(client);