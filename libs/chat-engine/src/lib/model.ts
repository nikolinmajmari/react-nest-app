
export enum State{
  idle,
  loading,
  success,
  error,
  updating,
}

export interface IAsyncState<T>{
  status:State,
  error: any,
  data:T
}

export interface IChannel{

}


type IChannelsState = IAsyncState<IChannel>
