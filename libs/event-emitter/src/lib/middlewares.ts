import {IAppEvent, MiddlewareFunction} from "./types";

/**
 * Middlewares
 */
const matchParamsMiddleware = function (params:any):MiddlewareFunction{
  return looseMatch(params);
}

const looseMatch = function (params:any):MiddlewareFunction{
  return async (event:IAppEvent<any,any>) =>{
    console.log('matching ',event.params,' with ',params);
    if(!event.params || !params){
      return false;
    }
    for (const key of Object.keys(params)){
      if(params[key]!==event.params[key]){
        return false;
      }
    }
    return true;
  }
}

const strictMatch = function (params:any):MiddlewareFunction{
  return async (event:IAppEvent<any,any>) =>{
    if(!event.params || !params){
      return false;
    }
    if(Object.keys(params).length!==Object.keys(event.params).length){
      return false;
    }
    for (const key of Object.keys(params)){
      if(params[key]!==event.params[key]){
        return false;
      }
    }
    return true;
  }
}

export const middlewares = {
  matchParamsMiddleware,looseMatch,strictMatch
};
