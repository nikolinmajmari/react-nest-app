import React from "react";
import ChannelMessagesSkeleton from "../../../../components/messages/MessagesSkeleton";
import AnimatedOpacity from "../../../../components/AnimatedOpacity";
import ChannelEntry from "./Entry";
import {ChannelContext} from "../../channel-context";
import ChannelFeed from "./Feed";
import {useChannelFeedStatus, useDispatchLoadFeed} from "../../../../app/hooks/feed";

export interface IChannelFeedContainerProps {
  navigation: React.ReactElement
}


export default function ChannelFeedContainer({navigation}: IChannelFeedContainerProps) {
  const feedRef = React.useRef<HTMLDivElement>(null);
  const {channel} = React.useContext(ChannelContext)
  const loadMessages = useDispatchLoadFeed();
  const status = useChannelFeedStatus();
  React.useEffect(() => {
    if (channel && channel.id) {
      loadMessages(channel);
    }
  }, [channel?.id, loadMessages]);


  return (
    <div className=" flex flex-1 flex-col bg-neutral-200 dark:bg-gray-700">
      <AnimatedOpacity className='flex flex-col flex-1 overflow-y-scroll'>
        {navigation}
        {(status === "idle" || status === "loading") && <ChannelMessagesSkeleton/>}
        {status === "succeeded" && <ChannelFeed ref={feedRef}/>}
      </AnimatedOpacity>
      <ChannelEntry ref={feedRef}/>
    </div>
  );
}
