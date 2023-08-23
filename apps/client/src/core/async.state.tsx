export interface IAsyncState{
    status: 'idle' | 'loading' | 'succeeded' | 'failed',
    error: string | null
}

export const initialState:IAsyncState =  {
    status: "idle",
    error: null
}