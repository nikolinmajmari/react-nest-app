import AnimatedOpacity from "../../../components/AnimatedOpacity";
import {Outlet} from "react-router-dom";

export default function ChannelDetailsNavigationWrapper(props:any) {
  return (
    <AnimatedOpacity
      className='flex z-50 w-full h-full bg-white dark:bg-gray-800 absolute flex-col flex-1 overflow-y-auto items-strech transition-opacity opacity-100'>
        {props.children}
    </AnimatedOpacity>
  );
}
