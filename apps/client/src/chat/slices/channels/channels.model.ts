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

export interface IChannelsState{
  status: 'idle' | 'loading' | 'succeeded' | 'failed',
  error: any | null,
  channels:Channel[],
  activeChannel:number|null;
}