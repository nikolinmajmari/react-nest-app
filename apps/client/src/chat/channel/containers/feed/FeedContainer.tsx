import React from "react";
import ChannelMessagesSkeleton from "../../../../components/messages/MessagesSkeleton";
import AnimatedOpacity from "../../../../components/AnimatedOpacity";
import ChannelEntry from "./Entry";
import {ChannelContext} from "../../channel-context";
import ChannelFeed from "./InfiniteFeed";
import {useChannelFeedStatus, useDispatchLoadFeed, useDispatchLoadInitialFeed} from "../../../../app/hooks/feed";
import {SelectedContext} from "../../context/SelectedContext";
import {ChannelFeedNavigation, DeleteMessagesNavigation} from "../ChannelNavigation";
import CircleLoader from "../../../../components/CircleLoader";
import {useInView} from "react-intersection-observer";
import {useAppSelector} from "../../../../app/hooks";
import InfiniteFeed from "./InfiniteFeed";

export default function ChannelFeedContainer() {
  const feedRef = React.useRef<HTMLDivElement>(null);
  const {channel} = React.useContext(ChannelContext)
  const {selected} = React.useContext(SelectedContext);
  const loadInitialFeed = useDispatchLoadInitialFeed();
  const status = useChannelFeedStatus();
  React.useEffect(() => {
    if (channel && channel.id) {
      loadInitialFeed(channel);
    }
  }, [channel?.id]);
  return (
    <div className="relative flex  flex-1 flex-col bg-neutral-200 dark:bg-gray-700">
      {
        status==="mutating" && (
          <div
            className={'absolute w-full h-full bg-gray-700 bg-opacity-20 flex justify-center items-center z-20'}
          >
            <CircleLoader></CircleLoader>
          </div>
        )
      }
      {
        selected.length===0?
          <ChannelFeedNavigation/>
          :
          <DeleteMessagesNavigation/>
      }
      <AnimatedOpacity
                       className='flex flex-col-reverse flex-1 overflow-y-scroll'
                       id={'chat_feed_scrollable'}
                       ref={feedRef}
      >
        {(status === "idle" || status === "loading") &&
          <ChannelMessagesSkeleton/>
        }
        {(status === "succeeded" || status === "mutating") && (
          <InfiniteFeed ref={feedRef}/>
        )}
      </AnimatedOpacity>
      <ChannelEntry disabled={status!=="succeeded"} ref={feedRef}/>
    </div>
  );
}
