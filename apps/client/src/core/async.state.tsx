export interface IAsyncState{
    status: 'idle' | 'loading' | 'succeeded' | 'failed' | "mutating",
    error: string | null | any;
}
