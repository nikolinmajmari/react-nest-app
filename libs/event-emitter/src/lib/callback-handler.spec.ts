import {describe, expect} from "vitest";
import {CallBackHandler} from "./callback-handler";
import {CallBackFunction, IAppEvent} from "./types";
import {middlewares} from "./middlewares";


describe('CallbackHandler',()=>{

  var buildEvent = (params:any)=>{
    return {
      data: 'sample',
      params
    } as IAppEvent<any, any>;
  }

  it('should register exact callback',()=>{
    const cb:CallBackFunction = (e)=>{};
    const instance = new CallBackHandler(cb,[]);
    expect(instance.cb).toEqual(cb);
  });

  it('should match all middlewares when match is called',()=>{
    const m1 = middlewares.looseMatch({id:1});
    const m2 = middlewares.looseMatch({event:'message'});
    const instance = new CallBackHandler(
      (_)=>{},
      [m1,m2]
    );
    expect(instance.match(buildEvent({id:1}))).resolves.toBeFalsy();
    expect(instance.match(buildEvent({event:"message"}))).resolves.toBeFalsy();
    expect(instance.match(buildEvent({"id":1,'event':'message'}))).resolves.toBeTruthy();
  });
});
