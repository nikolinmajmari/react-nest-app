import {IChannel} from "@mdm/mdm-core";
import {channelsApi} from "../../api/channels-api";

export interface IChannelMemberRemoveArgs{
  channel:string;
  member:string;
}

const extendedApi = channelsApi.injectEndpoints({
  overrideExisting:false,
  endpoints:(builder)=>({
    getChannel:builder.query<IChannel,string>({
      query:(id)=>`/${id}`,
      providesTags: (result,error,id)=>[{type:"Channel",id}]
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
      invalidatesTags: (result,error,args)=>([
        {type:'Channel',id:args.channel}
      ])
    })
  })
})

export const {
  useGetChannelQuery,
  useRemoveChannelMemberMutation,
} = extendedApi;