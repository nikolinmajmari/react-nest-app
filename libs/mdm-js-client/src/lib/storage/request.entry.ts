import {AxiosRequestConfig} from "axios";
import {AppEventEmitter} from "./event.emitter";


export type ReplyCallback<T> = (config:AxiosRequestConfig<T>)=>Promise<T>;
export default class RequestEntry<T>{

  #controller?:AbortController;

  constructor(
    private handler:ReplyCallback<T>
  ) {}
  get controller(){
    return this.#controller;
  }

  async reply<T>(config:AxiosRequestConfig){
    try{
      this.#controller = new AbortController();
      return await this.handler({
        signal: this.controller?.signal,
        ...config
      })
    }catch(e){
      throw e;
    }
  }

}
