import { Outlet, useParams } from "react-router-dom";
import storage from "../../core/storage";
import { LinkNavigationButton, NavigationButton } from "../../components/channels/default";
import { TfiComments, TfiHeadphone } from "react-icons/tfi";

export default function NavigationContainer(){
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
            <div className='relative flex flex-col-reverse items-stretch md:flex-row w-full flex-1 overflow-hidden bg-cyan-50'>
                <div className={`${id===undefined ? 'flex':'hidden'} md:w-20 md:flex md:flex-col md:justify-center md:items-center bg-emerald-800 bg-opacity-40 z-10`}>
                    <LinkNavigationButton to={"/chat"}><TfiComments/></LinkNavigationButton>
                     <LinkNavigationButton to={"/calls"}><TfiHeadphone/></LinkNavigationButton>
                </div>
               <div className="relative flex flex-col-reverse items-stretch md:flex-row w-full flex-1 overflow-hidden bg-cyan-50">
                <Outlet/>
               </div>
            </div>
        </div>
    );
}