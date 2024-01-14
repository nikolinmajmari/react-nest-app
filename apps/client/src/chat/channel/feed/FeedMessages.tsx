import React, {forwardRef} from "react";
import InfiniteScroll from "react-infinite-scroll-component"
import Message, {IChatMessageProgress, MessageFlowType} from "../components/messages/Message";
import {
  useAbortMediaProgress, useAddWsMessage, useChannelFeedHasMore,
  useChannelFeedMessages, useDispatchAddMessage,
  useDispatchLoadFeed,
  useRetryPostMessage
} from "../slices/hooks/feed";
import {useCurrentUser} from "../../../app/hooks/auth";
import {IFeedMessage} from "../slices/channel-feed.model";
import {motion, AnimatePresence} from "framer-motion";
import ThreeDotsWave from "../../../components/ThreeDotsWave";
import {ChannelContext} from "../providers/ChannelProvider";
import {SelectedContext} from "../../../providers/SelectedContextProvider";
import {WebSocketContext} from "../../../providers/WebsocketConnectionProvider";
import {IMessage} from "@mdm/mdm-core";
import emitter from "../../../util/app.emitter";
import {IAppEvent,middlewares} from "@mdm/event-emitter";
import {ws} from "@mdm/mdm-core";

const FeedMessages = forwardRef(function (props, fwRef) {
  const messages = useChannelFeedMessages();
  const {channel} = React.useContext(ChannelContext);
  const loadFeed = useDispatchLoadFeed();
  const hasMore = useChannelFeedHasMore();
  const addMessage = useAddWsMessage();
  const handleAddMessage = React.useCallback((ev:IAppEvent<IMessage, any>)=>{
    setTimeout(()=> addMessage(ev.data));
  },[channel]);
  React.useEffect(()=>{
    emitter.on(ws.WsEvents.CHANNEL_MESSAGE_CREATED,
      middlewares.looseMatch({channel:channel?.id}),
      handleAddMessage
    );
    return ()=>{
      emitter.remove('message',handleAddMessage);
    }
  },[emitter,handleAddMessage]);
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
  const {channel} = React.useContext(ChannelContext)!;
  const retryPostMessage = useRetryPostMessage(channel!.id,message);
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
                 message.sender.id===previous?.sender?.id && (!diffDay||(message.createdAt==undefined))
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


export default FeedMessages;
