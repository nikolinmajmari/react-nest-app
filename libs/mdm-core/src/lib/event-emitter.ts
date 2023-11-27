
export class CallBackHandler{
  constructor(
    private _cb:any,
    private _params?:any,
    private _once?:boolean,
  ) {
  }

  get params(){
    return this._params;
  }

  get once(){
    return this._once;
  }
  get cb(){
    return this._cb;
  }

  match(params?:Record<string, string|number>){
    if(!this.params){
      return true;
    }
    if(!params){
      return false;
    }
    if(Object.keys(params).length!==Object.keys(this.params).length){
      return false;
    }
    for (const key of Object.keys(params)){
      if(params[key]!==this.params[key]){
        return false;
      }
    }
    return true;
  }

}

/**
 *
 */
export class EventEmitter{
  /**
   *
   */
  listeners = new Map<string,CallBackHandler[]>();

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
  on<E extends any>(event:string,cb:(a:E)=>void):void;
  on<P extends any,E extends any>(event:string,params:P,cb:(e:E)=>void):void;
  on(event:string,...rest:any){
    if(rest.length===0 || rest.length>2){
      throw new Error('invalid number of params')
    }
    let handlers = this.listeners.get(event)||[] as CallBackHandler[];
    this.listeners.set(event,[
      ...handlers,
      new CallBackHandler(
        rest.length===1 ? rest[1]:rest[2],
        rest.length === 2 ? rest[1]:undefined,
      )
    ])
  }

  /**
   *
   * @param event
   * @param cb
   */
  remove(event:string,cb:any){
    const handlers = this.listeners.get(event)||[];
    this.listeners.set(event,handlers.filter((handler)=>{
      return handler.cb!==cb;
    }));
  }

  /**
   *
   * @param event
   * @param cb
   */
  once<E extends any>(event:string,cb:(a:E)=>void):void;
  once<P extends any,E extends any>(event:string,params:P,cb:(e:E)=>void):void;
  once(event:string,...rest:any){
    if(rest.length===0 || rest.length>2){
      throw new Error('invalid number of params')
    }
    let handlers = this.listeners.get(event)||[] as CallBackHandler[];
    this.listeners.set(event,[
      ...handlers,
      new CallBackHandler(
        rest.length===1 ? rest[1]:rest[2],
        rest.length === 2 ? rest[1]:undefined,
        false
      )
    ])
  }


  /**
   *
   * @param event
   * @param params
   * @param args
   */
  emit(event:string,params:any=undefined,...args:any[]){
    let handlers = this.listeners.get(event)||[];
    let once = [];
    handlers.forEach((handler)=>{
      if(handler.match(params)){
        if(handler.once){
          once.push(handler);
        }
        setTimeout(()=>handler.cb(...args))
      }
    })
  }
}



