import {ArgumentsHost, BadRequestException, Catch} from "@nestjs/common";
import {BaseWsExceptionFilter, WsException} from "@nestjs/websockets";
import {IWsRequest, IWsResponse} from "../../../../../libs/mdm-core/src/lib/ws";


@Catch(BadRequestException)
export class BadRequestTransformationFilter extends BaseWsExceptionFilter{
  catch(exception: any, host: ArgumentsHost) {
    const propError = new WsException((exception.getResponse()));
    const ctx = host.switchToWs();
    const client:WebSocket = ctx.getClient();
    const data = ctx.getData<IWsRequest<any>>();
    client.send(JSON.stringify({
      id:data.id,
      error:exception.getResponse()
    } as IWsResponse<any,any>))
    super.catch(propError, host);
  }
}
