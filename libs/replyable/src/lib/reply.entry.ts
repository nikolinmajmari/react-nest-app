export type ReplyCallback<R extends any = any,C extends any=any> = (config:C|IReplyConfig)=>Promise<R>|R;

export interface IReplyConfig{
  signal?:AbortSignal
}

export default class ReplyEntry<R,C extends IReplyConfig = IReplyConfig>{

  #controller?:AbortController;

  constructor(
    private handler:ReplyCallback<R,C>
  ) {}
  get controller(){
    return this.#controller;
  }

  abort(){
    return this.controller.abort();
  }

  async reply(config?:C):Promise<R>{
    try{
      this.#controller = new AbortController();
      return this.handler({
        signal:this.#controller.signal,
        ...config
      })
    }catch(e){
      throw e;
    }
  }

}
