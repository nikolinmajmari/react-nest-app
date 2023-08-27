export interface Channel{
    id:number,
    alias:string|null,
    type: "group"|"direct",
    memberNo: number,
    lastMessage:string,
    lastSender:string,
}


export interface ChannelMember{
    user:UserContact;
    joinedAt:Date;
    role: "admin"|"member";
    status:"pending"|"accepted"|"declined";
}

export interface UserContact{
    firstName:string,
    lastName:string,
    email:string,
}


export interface IChannelMessage{
    type?:"media"|"text"|"recording"|"voiceCall"|"videoCall",
    content:string,
    token?:string|undefined,
    status:"sent"|"received"|"pending"|"failed";
    createdAt?:Date,
    sender:number
}


export interface IChannelState{
  status: 'idle' | 'loading' | 'succeeded' | 'failed',
  error: any | null,
  id:null,
  messages:IChannelMessage[],
}