import {IChannel, IChannelMember, IPartialChannelMember} from "@mdm/mdm-core";
import {channelsApi} from "../../api/channels-api";
import {channels} from "../../../api.client/client";

export interface IChannelMemberRemoveArgs{
  channel:string;
  member:string;
}

export interface IChannelMemberAddArgs{
  channel:string,
  member:IPartialChannelMember
}

export interface IMemberUpdateArgs{
  channel:string,
  member:string;
  update:Pick<IChannelMember, "role">;
}

export interface IChannelMemberBatchAddArgs{
  channel:string,
  members:IPartialChannelMember[]
}

const extendedApi = channelsApi.injectEndpoints({
  overrideExisting:false,
  endpoints:(builder)=>({
    getChannel:builder.query<IChannel,string>({
      query:(id)=>`/${id}`,
      providesTags: (result,error,id)=>[{type:"Channel",id}]
    }),
    addChannelMember:builder.mutation<IChannelMember,IChannelMemberAddArgs>({
      query:({channel,member})=>({
        url:`/${channel}/members`,
        method:'POST',
        body:member
      }),
      async onQueryStarted(arg,{dispatch,queryFulfilled}): Promise<void>  {
        try{
          const { data } = await queryFulfilled;
          dispatch(
            extendedApi.util.updateQueryData('getChannel',arg.channel,(draft)=>{
             draft.members.push(data);
            })
          );
        }catch{}
      },
     // invalidatesTags:(res,err,{channel})=>[{type:'Channel',id:channel}]
    }),
    updateChannelMember:builder.mutation<IChannelMember,IMemberUpdateArgs>({
      queryFn:async (arg)=>{
        return await channels.updateMember(arg.member!,arg.update);
      },
      async onQueryStarted(arg, api): Promise<void>  {
        const patchResult = api.dispatch(
          extendedApi.util.updateQueryData('getChannel',arg.channel,(draft)=>{
            const id = draft.members.findIndex(m=>m.id==arg.member);
            draft.members[id] = {
              ...draft.members[id],
              ...arg.update
            }
          })
        );
        try{
          const data = await api.queryFulfilled;
        }catch{
          patchResult.undo();
        }
      },
   //   invalidatesTags: (result,error,args)=>([{type:'Channel',id:args.channel}])
    }),
    removeChannelMember: builder.mutation<unknown,IChannelMemberRemoveArgs>({
      query:(arg)=>({
        url:`/${arg.channel}/members/${arg.member}`,
        method:'DELETE'
      }),
      async onQueryStarted(arg, api): Promise<void>  {
        const patchResult = api.dispatch(
          extendedApi.util.updateQueryData('getChannel',arg.channel,(draft)=>{
            Object.assign(draft,{
              ...draft,
              members:draft.members.filter(m=>m.id!==arg.member)
            })
          })
        );
        try{
          await api.queryFulfilled
        }catch{
          patchResult.undo();
        }
      },
      //invalidatesTags: (result,error,args)=>([{type:'Channel',id:args.channel}])
    })
  })
})

export const {
  useGetChannelQuery,
  useAddChannelMemberMutation,
  useUpdateChannelMemberMutation,
  useRemoveChannelMemberMutation,
} = extendedApi;
