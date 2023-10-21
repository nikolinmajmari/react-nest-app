import {boolean, func, number} from "joi";

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
  [P in keyof T]:
    T extends null | undefined ? T :(
        T extends object ? (
            Awaited<T[P]> extends ArrayLike<any> ?
                DeepPartialArrayResolve<Awaited<T[P]>>|undefined
                :
                Awaited<T[P]> extends Function ?
                    T[P]
                    :
                    DeepPartialResolve<Awaited<T[P]>>|undefined
                )
            :
            T
    );
}


export type DeepPartialArrayResolve<T> = {
  [P in keyof T]:P extends number ?
        DeepPartialResolve<Awaited<T[P]>>
        :
        T[P]
}
