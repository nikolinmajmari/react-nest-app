import { animated, useSpring } from "@react-spring/web";
import { TfiArrowLeft, TfiCamera, TfiHeadphone, TfiMenu } from "react-icons/tfi";
import { Link } from "react-router-dom";

export default function ChannelSettings(){
        const springs = useSpring({
   from: { opacity: 0},
    to: { opacity: 1 },
     enter: { opacity: 1 },
    leave: { opacity: 0 },
    config:{
        duration: 150
    }
  })
    return (
    <animated.main style={{...springs}} className={'flex z-50 w-full h-full bg-white absolute flex-col flex-1 overflow-y-auto transition-opacity opacity-100'}>
        <div className=" bg-cyan-200 bg-opacity-20 sticky top-0 backdrop-blur-xl flex flex-row items-center">
            <div className="h-20 flex flex-row items-center justify-between w-full">
                <div className="actions flex flex-row justify-start items-center px-4">
                    <Link to={"/chat/channels/12"} className="p-4 text-teal-800 rounded-full font-bold text-2xl cursor-pointer hover:bg-teal-800 hover:bg-opacity-20 transition-colors">
                        <TfiArrowLeft/>
                    </Link>
                </div>
                <div className="actions flex flex-row justify-start items-center px-4">
                    <span className="p-4 text-teal-800 rounded-full font-bold text-2xl cursor-pointer hover:bg-teal-800 hover:bg-opacity-20 transition-colors">
                        <TfiHeadphone/>
                    </span>
                     <span className="p-4 text-teal-800 rounded-full font-bold text-2xl cursor-pointer hover:bg-teal-800 hover:bg-opacity-20 transition-colors">
                        <TfiCamera/>
                    </span>
                     <Link to={"settings"} className="p-4 text-teal-800 rounded-full font-bold text-2xl cursor-pointer hover:bg-teal-800 hover:bg-opacity-20 transition-colors">
                        <TfiMenu/>
                    </Link>
                </div>
            </div>
        </div>
        <div className="content flex-1">
            Settings here
        </div>
    </animated.main>);
}
