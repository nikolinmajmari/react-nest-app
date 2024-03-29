import React, {forwardRef} from "react";
import InfiniteScroll from "react-infinite-scroll-component"
import Message, {IChatMessageProps} from "../components/messages/Message";
import {
  useAbortMediaProgress,
  useAddWsMessage,
  useChannelFeedHasMore,
  useChannelFeedMessages,
  useDispatchLoadFeed,
  useRetryPostMessage
} from "../slices/hooks/feed";
import {useCurrentUser} from "../../../app/hooks/auth";
import {IFeedMessage, IFeedMessageMedia} from "../slices/channel-feed.model";
import {AnimatePresence, motion} from "framer-motion";
import ThreeDotsWave from "../../../components/ThreeDotsWave";
import {ChannelContext} from "../providers/ChannelProvider";
import {Align} from "../components/messages/Wrappers";
import MotionFadeIn from "../../../components/motion/MotionFadeIn";
import {MessageMediaContent} from "../components/messages/MediaComponents";
import {useOnChannelMessageReceivedEffect} from "../../hooks";

export function NoMoreWidget(){
  return (
    <div className={'w-full py-3 mt-4 text-center flex items-center justify-center'}>
         <span className={
           'rounded-full  px-4 py-1 ' +
           'bg-emerald-900 bg-opacity-30 text-emerald-800 text-xs shadow' +
           ' dark:text-white '
         }> No more messages to fetch</span>
    </div>
  );
}

const FeedMessages = forwardRef(function (props, fwRef) {
  const messages = useChannelFeedMessages();
  const addWsMessage = useAddWsMessage();
  const {channel} = React.useContext(ChannelContext);
  const loadFeed = useDispatchLoadFeed();
  const hasMore = useChannelFeedHasMore();

  useOnChannelMessageReceivedEffect(channel!,(data)=>{
    addWsMessage(data);
  },[addWsMessage]);
  return (
    <InfiniteScroll
      dataLength={messages.length}
      next={()=>{
        loadFeed(channel!);
      }}
      className={'flex flex-col-reverse'}
      hasMore={hasMore}
      inverse={true}
      endMessage={<NoMoreWidget/>}
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
  )
});

export interface IChannelMessageContainerProps {
  message: IFeedMessage,
  previous:IFeedMessage|undefined,
}

export function ChannelMessageContainer({message,previous}: IChannelMessageContainerProps) {
  const user = useCurrentUser();
  let diffDay= message?.createdAt?.toString().slice(0, 10)!=previous?.createdAt?.toString().slice(0, 10);
  return (
   <>
     <AnimatePresence key={message.id??Math.random().toString(16)}>
       {
         !message.deleting && (
           <Message
             key={message.id}
             id={message.id!}
             sender={message.sender}
             content={message.content}
             timestamp={message?.createdAt?.toString().slice(0, 10) ?? ""}
             align={message.sender?.id !== user.id ? Align.left : Align.right}
             reduced={
               message.sender.id===previous?.sender?.id && (!diffDay||(message.createdAt==undefined))
             }>
             { message.media && message.media.operation && <MessageMediaContainer message={message}/> }
             {message.media && !message.media.operation && <MessageMediaContent media={message.media!}/> }
           </Message>
         )
       }
     </AnimatePresence>
     {
       diffDay && message.createdAt && <FeedTimeLabel
         key={message?.createdAt?.toString().slice(0, 10) ?? Math.random().toString(16)}
         label={ message?.createdAt?.toString().slice(0, 10) ?? ""}
       />
     }
   </>
  );
}

interface IMessageMediaProps{
  message:IFeedMessage
}

function MessageMediaContainer({ message }: IMessageMediaProps){
  const cancelMediaProgress = useAbortMediaProgress({
    slug:message.slug!,requestKey:message.media!.operation!.requestKey
  });
  const restartMediaProgress = useRetryPostMessage(message);
  return (
    <MessageMediaContent media={message.media!}
                         cancelProgress={cancelMediaProgress}
                         restartProgress={restartMediaProgress}
                         />
  );
}



export default FeedMessages;


export function FeedTimeLabel({label}:{label:string}){
  return (
    <div className={'flex justify-center py-3 mt-8 items-center'}>
           <span className={
             'rounded-full  px-4 py-1 ' +
             'bg-emerald-900 bg-opacity-30 text-emerald-800 text-xs shadow' +
             ' dark:text-white '
           }>
           {
            label
           }
         </span>
    </div>
  );
}
