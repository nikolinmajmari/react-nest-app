import {BaseClient} from "@mdm/mdm-js-client";
import {ReplyStorage,ReplyEntry} from "@mdm/replyable";


export abstract class AbstractRepository {
  public readonly storage = new ReplyStorage();
}
