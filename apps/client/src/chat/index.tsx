
import Channels from "./channels";
import { Outlet, useParams} from "react-router-dom";
import storage from "../core/storage";
import ChannelContainer from "./channel";

export default function Chat(){
    const handleLogout = ()=>{
        storage.clear();
        window.location.reload();
    }
    const {id} = useParams();
    return (
        <div className="flex flex-col w-full h-full items-stretch">
            <div className="h-16 bg-emerald-900 flex flex-row-reverse items-center px-12">
                <button onClick={handleLogout}>Log Out</button>
            </div>
            <div className='relative flex h-full items-stretch flex-row w-full flex-1 overflow-hidden bg-cyan-50'>
                <div className={`${id===undefined ? 'flex':'hidden'} flex w-full h-full md:flex md:w-96 bg-white `}>
                     <Channels/>
                </div>
                <div className={`${id===undefined ? 'hidden':'flex'} relative md:flex flex-1`}>
                    <Outlet/>
                </div>
            </div>
        </div>
    );
}

export {
  ChannelContainer
};