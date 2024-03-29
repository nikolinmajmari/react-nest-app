import { animated, useSpring } from "@react-spring/web";
import {Link, useLocation} from "react-router-dom";

export default function ChannelEmpty(){
     const springs = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
  })
  const location = useLocation();
    return (
       <animated.div style={{...springs}} className=" flex flex-col flex-1 bg-emerald-slate-100 dark:bg-gray-700 ">
        <div className="flex flex-col items-center justify-center py-12">
        <img src="https://cdn-icons-png.flaticon.com/128/907/907717.png" alt="Welcome Icon" className="w-24 h-24 mb-4 dark:text-white"/>
        <h2 className="text-3xl font-semibold mb-2 dark:text-white">Welcome to Our App!</h2>
        <p className="text-gray-600 dark:text-gray-100 text-center text-lg leading-relaxed">Start your journey with us by exploring the amazing
            features we have to offer:</p>
        <ul className="mt-4 text-gray-600 text-center text-base leading-relaxed dark:text-gray-200">
            <li className="mb-2"><span className="text-green-500">✔</span> Create and share stunning content.</li>
            <li className="mb-2"><span className="text-green-500">✔</span> Connect with like-minded users.</li>
            <li className="mb-2"><span className="text-green-500">✔</span> Discover inspiring stories and ideas.</li>
            <li className="mb-2"><span className="text-green-500">✔</span> Customize your profile and settings.</li>
        </ul>
        <Link state={{previousLocation: location}}
              to="/chat/channels/new"
              className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600"
        >Get Started</Link>
        </div>
       </animated.div>
    );
}
