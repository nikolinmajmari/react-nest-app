
import { TfiArrowLeft, TfiCamera, TfiEnvelope, TfiHeadphone, TfiMenu, TfiMenuAlt, TfiReceipt } from "react-icons/tfi";
import Message from "../../components/message";
import { Link, Outlet, Route, Routes } from "react-router-dom";
import { animated,useSpring } from '@react-spring/web';

export default function ChannelMain(){
    const springs = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config:{
        duration: 250
    }
  })
    return (<>
    <animated.main style={
        {...springs}
    } className={'flex flex-col flex-1 overflow-y-auto transition-opacity opacity-100'}>
                <ChannelNavigation/>
                    <div className="content flex-1">
                        <Message/>
                        <Message/>
                        <Message/>
                        <Message/>
                        <Message/>
                        <Message/>
                        <Message/>
                        <Message/>
                    </div>
            <ChannelEntry/>
    </animated.main>
    <Outlet/>
    </>);
}


export function ChannelNavigation(){
    return (
        <div className=" bg-cyan-200 bg-opacity-20 sticky top-0 backdrop-blur-xl flex flex-row items-center">
               <div className="h-20 flex flex-row items-center justify-between w-full">
                <div className="navigation">

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
    );
}

export function ChannelEntry(){
    return (
         <div className=" bg-white bg-opacity-20 sticky bottom-0 backdrop-blur-lg flex flex-row items-center">
               <div className="h-20 flex flex-row items-center justify-between w-full px-6 py-4">
                <input className='bg-white px-4 py-2 rounded-lg focus:bg-teal-50 flex-1 outline-none focus:outline-none'/>
                <button className="mx-2 bg-teal-900 text-white p-4 rounded-full "><TfiReceipt/></button>
               </div>
            </div>
    );
}