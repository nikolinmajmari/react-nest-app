import React, {forwardRef} from "react";
import InfiniteScroll from "react-infinite-scroll-component"
import Message, {IChatMessageProgress, MessageFlowType} from "./components/Message";
import {
  useAbortMediaProgress, useChannelFeedHasMore,
  useChannelFeedMessages,
  useDispatchLoadFeed,
  useRetryPostMessage
} from "../../../../app/hooks/feed";
import {useCurrentUser} from "../../../../app/hooks/auth";
import {IFeedMessage} from "../../slices/channel-feed.model";
import {SelectedContext} from "../../context/SelectedContext";
import {motion, AnimatePresence} from "framer-motion";
import {ChannelContext} from "../../channel-context";
import ThreeDotsWave from "../../../../components/ThreeDotsWave";


const InfiniteFeed = forwardRef(function (props, fwRef) {
  const messages = useChannelFeedMessages();
  const {channel} = React.useContext(ChannelContext);
  const loadFeed = useDispatchLoadFeed();
  const hasMore = useChannelFeedHasMore();
  return (
    <>
     <InfiniteScroll
       dataLength={messages.length}
       next={()=>{
         loadFeed(channel!);
       }}
       className={'flex flex-col-reverse'}
       hasMore={hasMore}
       inverse={true}
       endMessage={
       <div className={'w-full py-3 mt-4 text-center flex items-center justify-center'}>
         <span className={
           'rounded-full  px-4 py-1 ' +
           'bg-emerald-900 bg-opacity-30 text-emerald-800 text-xs shadow' +
           ' dark:text-white '
         }> No more messages to fetch</span>
       </div>}
       loader={<ThreeDotsWave/>}
       scrollableTarget={'chat_feed_scrollable'}
     >
       {
         messages.map(
           (message, index) =>{
             const previous = index>0?messages[index-1]:undefined;
             return(
               <ChannelMessageContainer key={message.id}
                                        message={message}
                                        previous={previous}
               />
             );
           }
         ).reverse()
       }
     </InfiniteScroll>
    </>
  )
});

export interface IChannelMessageContainerProps {
  message: IFeedMessage,
  previous:IFeedMessage|undefined,
}

export function ChannelMessageContainer({message,previous}: IChannelMessageContainerProps) {
  const user = useCurrentUser();
  const retryPostMessage = useRetryPostMessage(message);
  const cancelMediaProgress = useAbortMediaProgress();
  const {slug} = message;
  const selection = React.useContext(SelectedContext);
  const handleCancelMediaProgress = ()=>{
    cancelMediaProgress(slug!,message.media?.operation?.requestKey!);
  }
  let diffDay= message?.createdAt?.toString().slice(0, 10)!=previous?.createdAt?.toString().slice(0, 10);
  return (
   <>
     <AnimatePresence>
       {
         !message.deleting && (
           <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
           >
             <Message
               content={message.content ?? ""}
               media={message.media??undefined}
               timestamp={message?.createdAt?.toString().slice(0, 10) ?? ""}
               sender={message.sender ?? {firstName:'',lastName:''}}
               status={IChatMessageProgress.failed}
               mediaStatus={IChatMessageProgress.failed}
               onMediaProgressRestart={retryPostMessage}
               selected={selection?.isSelected(message.id!)??false}
               selectionMode={(selection?.selected?.length??0) > 0}
               toggleSelect={()=>selection?.toggle(message.id!)}
               onMediaProgressCancel={handleCancelMediaProgress}
               type={message.sender?.id !== user.id ? MessageFlowType.received : MessageFlowType.sent}
               reduced={
                 message.sender.id===previous?.sender?.id && !diffDay
               }/>
           </motion.div>
         )
       }
     </AnimatePresence>
     {
       diffDay && message.createdAt && (
         <div className={'flex justify-center py-3 mt-8 items-center'}>
           <span className={
             'rounded-full  px-4 py-1 ' +
             'bg-emerald-900 bg-opacity-30 text-emerald-800 text-xs shadow' +
             ' dark:text-white '
           }>
           {
             message?.createdAt?.toString().slice(0, 10) ?? ""
           }
         </span>
         </div>
       )
     }
   </>
  );
}


export default InfiniteFeed;
