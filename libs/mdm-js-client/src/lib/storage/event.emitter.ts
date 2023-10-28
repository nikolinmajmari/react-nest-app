

export type CallBack = (...arg:any)=>void;

export class AppEventEmitter{

  #events = new Map<string,CallBack[]>
  constructor() {}
  on(event:string,cb:CallBack){
    if(this.#events.get(event)){
      this.#events.set(event,[
        ...this.#events.get(event)!,
        cb
      ])
    }else{
      this.#events.set(event,[cb])
    }
  }

  clear(){
    this.#events = new Map<string,CallBack[]>();
  }
  emit(event:string,...data:any){
    const handlers = this.#events.get(event);
    if(handlers){
      handlers.forEach(function (handler){
        setTimeout(()=>handler(...data))
      })
    }
  }

}
