import React from "react";
import {Outlet, useParams} from "react-router-dom";
import {ChannelProvider} from "../channel-context";
import {ChannelSkeleton} from "../../../components/channels/ChannelSkeleton";
import ChannelFeedContainer from "./feed/FeedContainer";
import {useChannel} from "../../../app/hooks/channel";
import { SelectedContextProvider} from "../context/SelectedContext";


export default function ChannelContainer() {
  const {status, channel, loadChannel} = useChannel();
  const params:{channel?:string} = useParams();
  React.useEffect(function () {
    const timeout =
      params.channel && setTimeout(() => loadChannel(params.channel!));
    return () => {
      timeout && clearTimeout(timeout);
    };
  }, [params.channel, loadChannel]);
  return (<>
    {(status === "idle" || status === "loading") && <ChannelSkeleton/>}
    {(status === "succeeded" && channel !== null || channel !== null) && (
      <ChannelProvider channel={channel}>
        <SelectedContextProvider>
          <ChannelFeedContainer/>
        </SelectedContextProvider>
        <Outlet/>
      </ChannelProvider>)
    }
    {status === "failed" && (<div>
      "error"
    </div>)}
  </>);

}
