import { WSRPCAdapter } from './ws-rpc-adapter';
import { vi, beforeEach, expect} from "vitest";
import { IWsRequest } from 'libs/mdm-core/src/lib/ws';

var ws: any;
var instance:WSRPCAdapter;
var req = (id?:string)=>({id,data:'',event:''} as IWsRequest<any>)

class WebSocket extends EventTarget{
  send(){}
}

describe('wsRpcAdapter sample tests', () => {

  beforeEach(function (){
    ws = new WebSocket();
    instance = new WSRPCAdapter(ws);
  });

  it('should expect exact sent message within time using auto id',async () => {
    /// response
    const result = '123';

    vi.spyOn(ws,'send').mockImplementationOnce((payload)=>{
      setTimeout(()=>{
        const {id} = JSON.parse(payload as string);
        ws.dispatchEvent(new MessageEvent('message',{
          data: JSON.stringify({id,result})
        }));
      });
    });
    const rpcReq = instance.send(req());
    await expect(rpcReq).resolves.toEqual({id:expect.any(String),result});
  });

  it('should ignore other messages and return appropriate message with appropriate id',async ()=>{
    /// responses
    const rpcRes1 = {id:'1',result:'1'};
    const rpcRes2 = {id:'2',result:'2'};
    const rpcRes3 = {id:'3',result:'3'};

    /// sent the data
    const rpcReq1 = instance.send(req(rpcRes1.id));
    const rpcReq2 = instance.send(req(rpcRes2.id));
    const rpcReq3 = instance.send(req(rpcRes3.id));

    //// sent responses and expect exact response on each
    ws.dispatchEvent(new MessageEvent('message',{data: JSON.stringify(rpcRes1)}))
    ws.dispatchEvent(new MessageEvent('message',{data: JSON.stringify(rpcRes2)}))
    ws.dispatchEvent(new MessageEvent('message',{data: JSON.stringify(rpcRes3)}))

    /// expect exact response
    await expect(rpcReq1).resolves.toStrictEqual(rpcRes1);
    await expect(rpcReq2).resolves.toStrictEqual(rpcRes2);
    await expect(rpcReq3).resolves.toStrictEqual(rpcRes3);
  });

  it('should fail when 5 seconds pass without receiving any same id message',async ()=>{
    const rpcRes = {id:'1',result:'1'};
    const failedRpcReq = instance.send(req('not-found'));

    /// sent wrong response
    ws.dispatchEvent(new MessageEvent('message',{data: JSON.stringify(rpcRes)}))

    /// expect to fail
    await expect(failedRpcReq).rejects.toStrictEqual(WSRPCAdapter.timeoutError);
  });
});
