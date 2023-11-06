import {channelsApi} from "../api/channels-api";
import {IChannel, IChannelCreate} from "@mdm/mdm-core";

const extendedApi = channelsApi.injectEndpoints({
  overrideExisting:false,
  endpoints:(builder)=>({
    getChannels: builder.query<IChannel[],void>({
      query(){
        return '/';
      },
      providesTags:(result)=>{
        return result ?
          [
            ...result.map(({id})=>({type:'Channel',id} as const)),
            {type:'Channel',id:'LIST'}
          ]
          :
          [{type:'Channel',id:'LIST'}];
      }
    }),
    createChannel:builder.mutation<IChannel,IChannelCreate>({
      query:(arg)=>({
        url:'',
        method:'POST',
        body:arg
      }),
      async onQueryStarted({id,...rest},{dispatch,queryFulfilled}){
        try{
          const {data} = await queryFulfilled;
          dispatch(
            extendedApi.util.updateQueryData('getChannels',undefined,(draft)=>{
              draft.unshift(data)
            })
          );
        }catch {}
      }
    }),
    deleteChannel:builder.mutation<undefined,string>({
      query:(id:string)=>{
        return ({
          url:`/${id}`,
          method:'DELETE'
        });
      },
      async onQueryStarted(id,{dispatch,queryFulfilled}){
        const patchResult = dispatch(
          extendedApi.util.updateQueryData('getChannels',undefined,(draft)=>{
            const index = draft.findIndex((item)=>item.id==id);
            if(index!==-1){
              draft.splice(index,1);
            }
          })
        )
        try{
          await queryFulfilled
        }catch {
          patchResult.undo();
        }
      }
    }),
  })
});
export const {
  useGetChannelsQuery,
  useCreateChannelMutation,
  useDeleteChannelMutation,
} = extendedApi;
