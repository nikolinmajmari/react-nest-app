import React, {useCallback} from "react";

export enum AsyncStatus{
  idle,
  loading,
  success,
  failed
}
export interface IAsyncHookResult<T,R>  extends IAsyncHookState<R>{
  startAsyncHook:(data?: T|undefined) => Promise<void>
}
export interface IAsyncHookState<R>{
  status: AsyncStatus;
  success?: R;
  error?: any;
}

export function useAsyncHook<T, R>(handler: (data?: T|undefined) => Promise<R>): IAsyncHookResult<T,R> {
  const [async, setAsync] = React.useState<IAsyncHookState<R>>({
    status: AsyncStatus.idle,
  });
  const startAsync = async function (data?: T) {
    try {
      setAsync({
        status: AsyncStatus.loading
      })
      const success = await handler(data);
      setAsync({
        status: AsyncStatus.success, success
      })
    } catch (e) {
      setAsync({
        status: AsyncStatus.failed, error: e
      })
    }
  }
  const startAsyncHook = useCallback(startAsync,[handler]);
  return {...async, startAsyncHook};
}
