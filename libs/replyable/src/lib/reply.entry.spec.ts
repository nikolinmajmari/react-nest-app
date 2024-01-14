import ReplyEntry from "./reply.entry";
import {func} from "joi";


const delay = (timeout:number)=>new Promise<void>((resolve)=>{
  setTimeout(resolve,timeout);
})

describe('Tests for [ReplyEntry]',()=>{


  test('to complete to expected result', ()=>{
    const reply = new ReplyEntry<number,any>(function (arg){
      return Promise.resolve(10);
    });
    expect(reply.reply({})).resolves.toBe(10);
  });


  test('to abort and complete again expected result',async ()=>{
    const reply = new ReplyEntry<number>(function (arg){
      return new Promise((resolve,reject)=>{
        const handleAbortion = (e:Event)=> reject(e.type);
        arg.signal.addEventListener('abort',handleAbortion);
        setTimeout(()=>{
          arg.signal.removeEventListener('abort',handleAbortion);
          resolve(10);
        },500)
      });
    });

    const firstTry = reply.reply();
    reply.abort();
    await expect(firstTry).rejects.toEqual('abort');
    const secondTry = reply.reply();
    await delay(200);
    reply.abort();
    await expect(secondTry).rejects.toEqual('abort');

    const thirdTry = reply.reply();
    await delay(800);
    reply.abort();
    await expect(thirdTry).resolves.toEqual(10);

  })


});
