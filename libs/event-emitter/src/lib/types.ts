
/**
 * Types
 */
export type MiddlewareFunction<D extends any = any,P extends any = any> = (event:IAppEvent<D,P>)=>Promise<boolean>|boolean;
export type CallBackFunction<D extends any = any,P extends any = any> = (event:IAppEvent<D,P>)=>void|Promise<void>;
export interface IAppEvent<D,P>{
  data: D,
  params?:P
}
