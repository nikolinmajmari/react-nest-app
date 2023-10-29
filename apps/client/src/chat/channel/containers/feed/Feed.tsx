import React, {forwardRef} from "react";
import Message, {IChatMessageProgress, MessageFlowType} from "./components/Message";
import {useAbortMediaProgress, useChannelFeedMessages, useRetryPostMessage} from "../../../../app/hooks/feed";
import {useCurrentUser} from "../../../../app/hooks/auth";
import {IFeedMessage} from "../../slices/channel-feed.model";


const ChannelFeed = forwardRef(function (props, ref) {
  const forwardedRef = ref as React.MutableRefObject<HTMLDivElement>;
  const user = useCurrentUser();
  const messages = useChannelFeedMessages();
  const handleAutoScroll = React.useCallback(() => {
    forwardedRef.current?.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"})
  }, [ref]);

  //// handle scroll
  React.useEffect(() => {
    setTimeout(handleAutoScroll);
  }, []);
  return React.useMemo(() => (<div className="content flex-1">
    {
      messages.map(
        (message, index) =>
          <ChannelMessageContainer key={index}
                                   message={message}
          />
      )
    }
    <div className="py-4" ref={forwardedRef}></div>
  </div>), [messages, ref]);
});

export interface IChannelMessageContainerProps {
  message: IFeedMessage,
}

export function ChannelMessageContainer({message}: IChannelMessageContainerProps) {
  const user = useCurrentUser();
  const retryPostMessage = useRetryPostMessage(message);
  const cancelMediaProgress = useAbortMediaProgress();
  const {slug} = message;
  const handleCancelMediaProgress = ()=>{
    cancelMediaProgress(slug!,message.media?.operation?.requestKey!);
  }
  return (<Message
    content={message.content ?? ""}
    media={message.media}
    timestamp={message?.createdAt?.toString().slice(0, 10) ?? ""}
    sender={message.sender ?? {firstName:'',lastName:''}}
    status={IChatMessageProgress.failed}
    mediaStatus={IChatMessageProgress.failed}
    onMediaProgressRestart={retryPostMessage}
    onMediaProgressCancel={handleCancelMediaProgress}
    type={message.sender?.id !== user.id ? MessageFlowType.received : MessageFlowType.sent}
    reduced={false}/>);
}


export default ChannelFeed;
