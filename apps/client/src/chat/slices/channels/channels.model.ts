export interface Channel{
    id:number,
    alias:string|null,
    type: "group"|"direct",
    memberNo: number,
    lastMessage:string,
    lastSender:string,
    members: ChannelMember[];
}


export interface ChannelMember{
    user:UserContact;
    joinedAt:Date;
    role: "admin"|"member";
    status:"pending"|"accepted"|"declined";
}

export interface UserContact{
    id:string;
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