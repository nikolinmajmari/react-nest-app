import {IWsRequest, IWsResponse} from "libs/mdm-core/src/lib/ws";

/**
 *
 */
export default class WebSocketJsonRPCAdapter{

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
    console.log('request with ',id);
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
      console.log('sending ',data,' to ',this.webSocket.readyState)
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
        reject({
          'error':{'message':'operation timed out'}
        })
      },4000);
    });
    return Promise.race([
      task,timeout
    ]) as Promise< IWsResponse<R, E>>;
  }
}
