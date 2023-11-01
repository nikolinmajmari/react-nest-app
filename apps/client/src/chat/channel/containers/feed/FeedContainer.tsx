import React from "react";
import ChannelMessagesSkeleton from "../../../../components/messages/MessagesSkeleton";
import AnimatedOpacity from "../../../../components/AnimatedOpacity";
import ChannelEntry from "./Entry";
import {ChannelContext} from "../../channel-context";
import ChannelFeed from "./Feed";
import {useChannelFeedStatus, useDispatchLoadFeed} from "../../../../app/hooks/feed";
import {SelectedContext} from "../../context/SelectedContext";
import {ChannelFeedNavigation, DeleteMessagesNavigation} from "../ChannelNavigation";
import CircleLoader from "../../../../components/CircleLoader";

export default function ChannelFeedContainer() {
  const feedRef = React.useRef<HTMLDivElement>(null);
  const {channel} = React.useContext(ChannelContext)
  const {selected} = React.useContext(SelectedContext);
  const loadMessages = useDispatchLoadFeed();
  const status = useChannelFeedStatus();
  React.useEffect(() => {
    if (channel && channel.id) {
      loadMessages(channel);
    }
  }, [channel?.id, loadMessages]);
  const FeedMemo =  React.useMemo(()=><ChannelFeed ref={feedRef}/>,[feedRef]);
  return (
    <div className="relative flex flex-1 flex-col bg-neutral-200 dark:bg-gray-700">
      {
        status==="mutating" && (
          <div
            className={'absolute w-full h-full bg-gray-700 bg-opacity-60 flex justify-center items-center z-20'}
          >
            <CircleLoader></CircleLoader>
          </div>
        )
      }
      <AnimatedOpacity className='flex flex-col flex-1 overflow-y-scroll'>
        {
          selected.length===0?
            <ChannelFeedNavigation/>
            :
            <DeleteMessagesNavigation/>
        }
        {(status === "idle" || status === "loading") &&
          <ChannelMessagesSkeleton/>
        }
        {(status === "succeeded" || status === "mutating") && FeedMemo }
      </AnimatedOpacity>
      <ChannelEntry ref={feedRef}/>
    </div>
  );
}
