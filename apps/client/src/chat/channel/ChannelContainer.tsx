import React from "react";
import {Outlet, Route, useParams} from "react-router-dom";
import {ChannelSkeleton} from "../../components/channels/ChannelSkeleton";
import ChannelFeedContainer from "./feed/FeedContainer";
import {SelectedContextProvider} from "../../providers/SelectedContextProvider";
import ChannelProvider from "./providers/ChannelProvider";
import NotFound from "../../routing/pages/NotFound";
import {useGetChannelQuery} from "./slices/channel-api";


export default function ChannelContainer() {
  const params:{channel?:string} = useParams();
  const {
    data,
    isSuccess,
    isUninitialized,
    currentData,
    error,
    isLoading
  } = useGetChannelQuery(params.channel!);
  return (<>
    {( isUninitialized || isLoading ) && <ChannelSkeleton/>}
    {(isSuccess && data) && (
      <ChannelProvider channel={data}>
        <SelectedContextProvider>
          <ChannelFeedContainer/>
        </SelectedContextProvider>
        <Outlet/>
      </ChannelProvider>)
    }
    {error && (<NotFound label={"Channels"}/>)}
  </>);

}
