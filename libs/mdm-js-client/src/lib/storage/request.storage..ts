import CacheEntry, {ReplyCallback} from "./request.entry";
import RequestEntry from "./request.entry";


export default class RequestStorage {
  private source = new Map<string,RequestEntry<any>>();

  get<T>(key:string):RequestEntry<T>|undefined{
    return this.source.get(key);
  }

  set(key:string,cb:ReplyCallback<any>){
    return this.source.set(key,new CacheEntry(cb));
  }

}
