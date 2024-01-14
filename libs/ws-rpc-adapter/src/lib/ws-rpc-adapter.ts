import {IWsRequest, IWsResponse} from "libs/mdm-core/src/lib/ws";

/**
 * This classes enforces rpc protocol for websocket
 * you may send a message via
 * const promise = adapter.send({data:payload,params:object,event:string})
 * and expect result via promise api
 * promise.then(res=>{id:res.id,result:res.result}).catch(timeout=>timeout);
 */
export class WSRPCAdapter{

  static timeoutError = {
    'error':{'message':'operation timed out'}
  };

  /**
   *
   * @param webSocket
   */
  constructor(
    private webSocket:WebSocket
  ) {
    this.handlers = new Map();
    this.webSocket.addEventListener('message', (event)=>{
      const parsed = JSON.parse(event.data);
      const {id} = parsed;
      if(this.handlers.has(id)){
        //// invoke handler and remove it
        this.handlers.get(id)!(parsed);
        this.handlers.delete(id);
      }
    });
    this.webSocket.addEventListener('close',(event)=>{
      this.handlers.forEach((handler)=>{
        if(handler){
          handler({
            error:{'message':'ws connection was closed'}
          })
        }
      })
    });
  }

  /**
   *
   * @private
   */
  private handlers = new Map<string,((res:IWsResponse<any,any>)=>void)|undefined>

  /**
   *
   * @param data
   */
  async send<R extends  any,E extends any>(data:IWsRequest<any>):Promise<IWsResponse<R, E>>{
    const id = data.id ?? (Math.random() + 1).toString(36).substring(7);
    const task =  new Promise<IWsResponse<R, E>>((resolve, reject)=>{
      const handler = (res:IWsResponse<any, any>)=>{
        if(res.error){
          return reject(res);
        }
        return resolve(res);
      };
      if(id){
        this.handlers.set(id,handler);
      }
      this.webSocket.send(JSON.stringify({
        ...data,
        id
      }));
    });
    const timeout = new Promise((resolve,reject)=>{
      setTimeout(()=>{
        if(id){
          this.handlers.delete(id);
        }
        reject(WSRPCAdapter.timeoutError)
      },4000);
    });
    return await Promise.race([
      task, timeout
    ]) as Promise< IWsResponse<R, E>>;
  }
}
