import {boolean, func, number} from "joi";
import {IMessage, IMessageEntity} from "./message";
import {IMedia} from "./media";

export type Resolve<T> =  {
    [P in keyof T]: Awaited<T[P]>;
}

export type PartialResolve<T> = {
   [P in keyof T]?: Awaited<T[P]>;
}
export type  t = Omit<any, any>

export type DeepResolve<T> = {
  [P in keyof T]: (
    T extends null|undefined ? T|undefined :
    (T extends object ?
      (
        Awaited<T[P]> extends ArrayLike<any> ?
          DeepArrayResolve<Awaited<T[P]>>
          :
          Awaited<T[P]> extends Function|Object|Date ?
            Awaited<T[P]>
            :
            DeepResolve<Awaited<T[P]>>
        )
      :
      T
      )
    );
}


export type DeepArrayResolve<T> = {
  [P in keyof T]:P extends number ?
    DeepResolve<Awaited<T[P]>>
    :
    T[P]
}



export type DeepPartialResolve<T> = {
  [P in keyof T]?:
    T extends null | undefined ? T :(
        T extends object ? (
            Awaited<T[P]> extends ArrayLike<any> ?
                DeepPartialArrayResolve<Awaited<T[P]>>|undefined
                :
                Awaited<T[P]> extends Function|Object|Date ?
                    Awaited<T[P]>
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
