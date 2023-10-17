
export type Resolve<T> =  {
    [P in keyof T]: Awaited<T[P]>;
}

export type PartialResolve<T> = {
   [P in keyof T]?: Awaited<T[P]>;
}


export type DeepResolve<T> = {
  [P in keyof T]: DeepResolve<Awaited<T[P]>>;
}

export type DeepPartialResolve<T> = {
  [P in keyof T]?: DeepPartialResolve<Awaited<T[P]>>;
}