import {BaseClient} from "@mdm/mdm-js-client";
import RequestStorage from "./request.storage.";
import RequestEntry, {ReplyCallback} from "./request.entry";


export abstract class AbstractRepository{

  public storage = new RequestStorage();


  protected replyable<T>(callback:ReplyCallback<T>):[string,RequestEntry<T>]{
    const key = (Math.random() + 1).toString(36).substring(7);
    this.storage.set(key,callback);
    return [
      key,this.storage.get<T>(key)!
    ];
  }
}
