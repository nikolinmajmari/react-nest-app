import ChannelDetailsNavigationWrapper from "./components/ChannelDetailsNavigationWrapper";
import {Outlet} from "react-router-dom";

export default function ChannelDetailsNavigation() {
  return (
    <ChannelDetailsNavigationWrapper>
      <Outlet/>
    </ChannelDetailsNavigationWrapper>
  );
}
