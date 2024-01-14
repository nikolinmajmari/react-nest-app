import {CallBackFunction, IAppEvent, MiddlewareFunction} from "./types";

/**
 * Classes
 */
export class CallBackHandler<D = any,P = any>{

  constructor(
    private _cb:CallBackFunction<D,P>,
    private _middlewares:MiddlewareFunction<D,P>[],
    private _once?:boolean,
  ) {
  }

  async match(event:IAppEvent<D,P>):Promise<boolean>{
    for (const middleware of this.middlewares){
      if(!await middleware(event)){
        return false
      }
    }
    return true;
  }

  get middlewares(){
    return this._middlewares;
  }
  get once(){
    return this._once;
  }
  get cb(){
    return this._cb;
  }

}
