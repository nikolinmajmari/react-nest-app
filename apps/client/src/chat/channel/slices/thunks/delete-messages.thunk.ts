import {createAsyncThunk} from "@reduxjs/toolkit";
import {IChannel} from "@mdm/mdm-core";
import {channels} from "../../../../api.client/client";

export interface IDeleteMessagesArgs{
  channel:IChannel;
  messagesId:string[],
  action?: Promise<any>,
}

export interface IDeleteMessageArgs{
  channel:IChannel;
  messageId:string,
  action?: Promise<any>
}

const deleteMessagesThunk = createAsyncThunk<void,IDeleteMessagesArgs>(
  '/channels/messages/delete',async (args,thunkApi)=>{
    if(args.action){
      return await args.action;
    }
    return await channels.deleteChannelMessages(args.channel.id,args.messagesId);
  }
);

const deleteMessageThunk = createAsyncThunk<void,IDeleteMessageArgs>(
  '/channels/messages/delete',async (args,thunkApi)=>{
    await channels.deleteChannelMessage(args.channel.id,args.messageId);
  }
);

export default deleteMessagesThunk;
