export * from './lib/mdm-core';
export * from './lib/channel';
export * from './lib/channel-member';
export * from './lib/message';
export * from './lib/media';
export * from './lib/user';

export * as ws from './lib/ws';
export * as ev from './lib/event-emitter';



export interface PaginationResponse<T>{
  data:T[],
  meta:{
    take:number,
    skip:number,
  },
}
