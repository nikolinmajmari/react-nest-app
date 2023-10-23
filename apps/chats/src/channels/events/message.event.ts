

export class MessageEvent {

  static NAME = "message.sent";
  constructor(data:any) {
    Object.assign(this,data);
  }

  channel:string;
  user:string;
  content:string;
  media?:string;
}
