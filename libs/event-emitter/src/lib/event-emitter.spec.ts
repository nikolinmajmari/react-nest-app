import {beforeEach, expect} from "vitest";
import {EventEmitter} from "./event-emitter";
import {middlewares} from "./middlewares";

class CallStack{
  public stack:any = {};
  reportCall(event:string,value:any){
    this.stack[event] = [...this.stack[event]??[],value];
  }

  getCallStack(event:string){
    return this.stack[event]??[];
  }
}


describe('eventEmitter', () => {
  var emitter:EventEmitter;
  var callStack:CallStack;
  var cb1:any,cb2:any,cb3:any,cb4:any,cbf:any;

  beforeEach(()=>{
    emitter = new EventEmitter();
    callStack = new CallStack();
    cb1 = ()=> callStack.reportCall('event1',1);
    cb2 = ()=> callStack.reportCall('event1',2);
    cb3 = ()=> callStack.reportCall('event1',3);
    cb4 = ()=> callStack.reportCall('event1',4);
    cbf = ()=>{
      callStack.reportCall('event1','e');
      throw Error('error');
    }
  });

  it('should invoke listeners in the order they were called', async () => {
    emitter.on('event1',cb1);
    emitter.on('event1',cb2);
    emitter.on('event1',cb3);
    await emitter.emit('event1',{});
    const stack = callStack.getCallStack('event1');
    expect(stack).toEqual([1,2,3]);
  });

  it('should invoke listeners only once when specified',async ()=>{
    emitter.on('event1',cb1);
    emitter.once('event1',cb2);
    emitter.on('event1',cb3);
    await emitter.emit('event1',{});
    await emitter.emit('event1',{});
    const stack = callStack.getCallStack('event1');
    expect(stack).toEqual([1,2,3,1,3]);
  });

  it('should remove listeners already registered',async ()=>{
    emitter.on('event1',cb1);
    emitter.once('event1',cb2);
    emitter.on('event1',cb3);
    await emitter.emit('event1',{});
    emitter.remove('event1',cb2);
    emitter.remove('event1',cb3);
    emitter.remove('event1',cb4);
    await emitter.emit('event1',{});
    const stack = callStack.getCallStack('event1');
    expect(stack).toEqual([1,2,3,1]);
  })

  it('should keep listener calls unaffected from each other errors',async ()=>{
    emitter.on('event1',cb1);
    emitter.once('event1',cb2);
    emitter.once('event1',cbf);
    emitter.on('event1',cbf);
    await emitter.emit('event1',{});
    await emitter.emit('event1',{});
    const stack = callStack.getCallStack('event1');
    expect(stack).toEqual([1,2,'e','e',1,'e'])
  });

  it('should remove all listeners of a specific callback',async ()=>{
    emitter.on('event1',cb1);
    emitter.once('event1',cb2);
    emitter.once('event1',cbf);
    emitter.on('event1',cbf);
    await emitter.emit('event1',{});
    let stack = callStack.getCallStack('event1');
    expect(stack).toEqual([1,2,'e','e']);
    emitter.remove('event1',cbf);
    await emitter.emit('event1',{});
    emitter.once('event1',cb4);
    emitter.remove('event1',cb4);
    stack = callStack.getCallStack('event1');
    expect(stack).toEqual([1,2,'e','e',1]);

  });

  /// testing with middleware

  it('should properly use middleware to filter out specific listeners',async ()=>{
    emitter.on('event1',middlewares.strictMatch({id:1}),cb1);
    emitter.on('event1',middlewares.looseMatch({event:'message'}),cb2);
    emitter.on('event1',[
      (_)=>true,
      (_)=>true,
      (_)=>false
    ],cb3);
    emitter.on('event1',[
      (_)=>true,
      (_)=>true,
    ],cb3);
    await emitter.emit('event1',{params:{id:1}});
    expect(callStack.getCallStack('event1')).toEqual([1,3]);
    await emitter.emit('event1',{params:{id:1,"event":'message'}});
    expect(callStack.getCallStack('event1')).toEqual([1,3,2,3]);
  });

  /// async
  it('should be async',async ()=>{
    emitter.on('event1',cb1);
    emitter.on('event1',cb2);
    emitter.on('event1',cb3);
    const customCallback = async ()=>{
      return new Promise<void>((resolve)=>{
        let i=0;
        while (i<100000){
          i++;
        }
        callStack.reportCall('event1','c')
        resolve();
      });
    };
    const promise = emitter.emit('event1',{});
    await customCallback();
    await promise;
    expect(callStack.getCallStack('event1')).toEqual(['c',1,2,3]);
  });
});
