import {BsFillChatFill} from "react-icons/bs";
import {Link, useLocation} from "react-router-dom";

export default function ChannelsEmpty(){
  const location = useLocation();
  return (<div className={'flex flex-col justify-center items-center flex-1'}>
    <span className={'py-4'}>
      <BsFillChatFill size={90} className={'text-blue-300'}/>
    </span>
    <Link  state={{previousLocation: location}}
           to={"/chat/channels/new"}
           className='bg-emerald-500 hover:bg-emerald-700 text-white rounded-full px-4 py-2'>
      New Channel
    </Link>
  </div>)
}
