import ReplyEntry, {ReplyCallback} from "./reply.entry";


export default class ReplyStorage {
  private source = new Map<string,ReplyEntry<any,any>>();

  get<R,C>(key:string):ReplyEntry<R,C>|undefined{
    return this.source.get(key);
  }

  add<R,C>(cb:ReplyCallback<R,C>):[string,ReplyEntry<R,C>]{
    const key = (Math.random() + 1).toString(36).substring(7);
    this.source.set(key,new ReplyEntry<R,C>(cb));
    return [
      key,this.source.get(key)
    ];
  }

}
