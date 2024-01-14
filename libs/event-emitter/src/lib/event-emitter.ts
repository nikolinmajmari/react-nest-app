import {CallBackFunction, IAppEvent, MiddlewareFunction} from "./types";
import {CallBackHandler} from "./callback-handler";


export class EventEmitter{
  /**
   *
   */
  listeners = new Map<string,CallBackHandler<any>[]>();

  /**
   *
   */
  constructor() {
  }

  /**
   *
   * @param event
   * @param cb
   */
  on<D=any,P=any>(event:string,cb:(a:IAppEvent<D,P>)=>void):void;
  on<D=any,P=any>(
    event:string,
    middlewares:MiddlewareFunction<D,P>[]|MiddlewareFunction<D,P>,
    cb:CallBackFunction<D,P>
  ):void;
  on<D=any,P=any>(event:string,...rest:any){
    if(rest.length===0 || rest.length>2){
      throw new Error('invalid number of params')
    }
    let handlers = this.listeners.get(event)||[];
    let middlewares = [];
    if(rest.length == 2){
      middlewares = Array.isArray(rest[0]) ? rest[0] : [rest[0]];
    }
    const callback = rest.pop();
    this.listeners.set(event,[
      ...handlers,
      new CallBackHandler<D,P>( callback,middlewares )
    ])
  }

  /**
   *
   * @param event
   * @param cb
   */
  remove(event:string,cb:CallBackFunction){
    const handlers = this.listeners.get(event)||[];
    this.listeners.set(event, handlers.filter((handler)=>{
      return handler.cb!==cb;
    }));
  }

  removeHandler(event:string,handler:CallBackHandler){
    const handlers = this.listeners.get(event)||[];
    this.listeners.set(event,handlers.filter(h=>h!==handler));
  }

  /**
   *
   * @param event
   * @param cb
   */
  once<D,P>(event:string,cb:CallBackFunction<D,P>):void;
  once<D,P>(
    event:string,
    middlewares: MiddlewareFunction<D,P>|MiddlewareFunction<D,P>[],
    cb:CallBackHandler<D,P>
  ):void;
  once<D=any,P=any>(event:string,...rest:any){
    if(rest.length===0 || rest.length>2){
      throw new Error('invalid number of params')
    }
    let handlers = this.listeners.get(event)||[];
    let middlewares = [];
    const callback = rest.pop();
    if(rest.length == 2){
      middlewares = Array.isArray(rest[1]) ? rest[1] : [rest[1]];
    }
    this.listeners.set(event,[
      ...handlers,
      new CallBackHandler<D,P>( callback,middlewares,true )
    ])
  }


  /**
   *
   * @param event
   * @param arg
   */
  async emit(event:string,arg:any):Promise<void>{
    let handlers = this.listeners.get(event)||[];
    const scheduledHandlers = [];
    for(const handler of handlers){
      if(await handler.match(arg)){
        if(handler.once){
          this.removeHandler(event,handler)
        }
        scheduledHandlers.push(handler);
      }
    }
    const promises = scheduledHandlers.map(function (handler){
      return new Promise<void>((resolve,reject)=>{
        setTimeout(async ()=> {
          try {
            resolve(await handler.cb(arg));
          }catch (e){
            reject(e);
          }
        },0);
    });
    });
    await Promise.allSettled(promises);
  }
}

