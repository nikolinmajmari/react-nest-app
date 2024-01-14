import {middlewares} from './middlewares';
import {beforeEach, expect} from "vitest";
import {IAppEvent} from "./types";

var buildEvent = (params:any)=>{
  return {
    data: 'sample',
    params
  } as IAppEvent<any, any>;
}

describe('middlewares', () => {

  it('looseMatch should loosely match params', () => {
    const params = {param1:'value1',param2:'value2'};
    const middleware = middlewares.looseMatch(params);
    expect(middleware(buildEvent(params))).resolves.toBeTruthy();
    expect(middleware(buildEvent({param1: params.param1}))).resolves.toBeFalsy();
    expect(middleware(buildEvent({}))).resolves.toBeFalsy();
    expect(middleware(buildEvent({...params,'px':1}))).resolves.toBeTruthy();
  });

  it('strictMatch should strictly match params', () => {
    const params = {    param1:'value1',param2:'value2'};
    const middleware = middlewares.strictMatch(params);
    expect(middleware(buildEvent(params))).resolves.toBeTruthy();
    expect(middleware(buildEvent({param1: 'value1'}))).resolves.toBeFalsy();
    expect(middleware(buildEvent({}))).resolves.toBeFalsy();
    expect(middleware(buildEvent({...params,'px':1}))).resolves.toBeFalsy();
  });
});



