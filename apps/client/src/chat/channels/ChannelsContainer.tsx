import {IChannel} from "@mdm/mdm-core";
import {useNavigate, useParams} from "react-router-dom";
import ChannelGroupContainer from "../../components/GroupContainer";
import React from "react";
import ChannelsSkeleton from "../../components/channels/ChannelsSkeleton";
import ChannelsHeader from "./ChannelsHeader";
import ErrorComponent from "../../components/ErrorComponent";
import ChannelsEmpty from "./ChannelsEmpty";
import {AnimatePresence, motion} from "framer-motion";
import { useGetChannelsQuery} from "./channels.api";
import ChannelTileContainer from "./ChannelContainer";


export default function ChannelsContainer() {
  const {
    isLoading,
    isError,
    error,
    isSuccess,
    data,
    isUninitialized,
    refetch
  } = useGetChannelsQuery();
  console.log(data,' as data');
  const {channel} = useParams();
  const navigate = useNavigate();
  const createNavigateHandler = (channel: IChannel) => {
    return () => {
      navigate(`${channel.id}`)
    }
  }
  return (
    <aside className='flex flex-col flex-1 bg-white overflow-y-auto relative dark:bg-gray-800'>
      {isLoading &&
        (isUninitialized ?
            <ChannelsSkeleton/>
            :
            <div className="opacity-20 bg-gray-600 w-full h-full top-0 absolute flex-1 flex"></div>
        )
      }
      {
        data && isSuccess && (
         <>
           <ChannelsHeader/>
           <ChannelGroupContainer label="Channels" className={'flex-1 flex flex-col'}>
             {
               data.length===0 && (<ChannelsEmpty/>)
             }
             {data.map(
               (ch: IChannel) =>{
                 console.log('rendering',ch);
                 return (
                   <AnimatePresence key={ch.id}>
                     <motion.div
                       initial={{ opacity: 0 }}
                       animate={{ opacity: 1 }}
                       exit={{ opacity: 0 }}
                     >
                       <ChannelTileContainer
                         key={ch.id}
                         channel={ch}
                         active={ch.id === channel}
                         navigate={createNavigateHandler(ch)}
                       />
                     </motion.div>
                   </AnimatePresence>
                 );
               }
             )
             }
           </ChannelGroupContainer>
         </>
        )
      }
      {
        error &&
        <ErrorComponent
          resolve={refetch}
          error={'An error occured'}/>
      }
    </aside>
  )
}

