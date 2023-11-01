import React, {forwardRef} from "react";
import Message, {IChatMessageProgress, MessageFlowType} from "./components/Message";
import {useAbortMediaProgress, useChannelFeedMessages, useRetryPostMessage} from "../../../../app/hooks/feed";
import {useCurrentUser} from "../../../../app/hooks/auth";
import {IFeedMessage} from "../../slices/channel-feed.model";
import {SelectedContext} from "../../context/SelectedContext";
import {motion,AnimatePresence} from "framer-motion";


const ChannelFeed = forwardRef(function (props, ref) {
  const forwardedRef = ref as React.MutableRefObject<HTMLDivElement>;
  const messages = useChannelFeedMessages();
  const handleAutoScroll = React.useCallback(() => {
    forwardedRef?.current?.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"})
  }, [forwardedRef]);

  //// handle scroll
  React.useEffect(() => {
    setTimeout(handleAutoScroll);
  }, [forwardedRef]);
  return (
    <div className="content flex-1">
      {
        messages.map(
          (message, index) =>{
            return(
              <ChannelMessageContainer key={index}
                                       message={message}
              />
            );
          }
        )
      }
      <div className="py-4" ref={forwardedRef}></div>
    </div>
  )
});

export interface IChannelMessageContainerProps {
  message: IFeedMessage,
}

export function ChannelMessageContainer({message}: IChannelMessageContainerProps) {
  const user = useCurrentUser();
  const retryPostMessage = useRetryPostMessage(message);
  const cancelMediaProgress = useAbortMediaProgress();
  const {slug} = message;
  const selection = React.useContext(SelectedContext);
  const handleCancelMediaProgress = ()=>{
    cancelMediaProgress(slug!,message.media?.operation?.requestKey!);
  }
  return (
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
              media={message.media}
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
              reduced={false}/>
          </motion.div>
        )
      }
    </AnimatePresence>
  );
}


export default ChannelFeed;
