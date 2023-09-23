import { animated, useSpring } from "@react-spring/web";
import { TfiArrowLeft, TfiCamera, TfiHeadphone, TfiMenu } from "react-icons/tfi";
import { Link } from "react-router-dom";
import { NavigationHeader } from "../../../../components/channels/NavigationHeader";
import { LinkNavigationButton } from "../../../../components/channels/default";
import AnimatedOpacity from "../../../../components/AnimatedOpacity";
import { useGetChannel } from "../../../../hooks/channel.hooks";
import { useGetCurrentUser } from "../../../../hooks/auth.hooks";
import { IChannelMember } from "@mdm/mdm-core";

export default function Settings(){
    const channel = useGetChannel();
    const user = useGetCurrentUser();
    const otherMember  =  channel?.members?.find((m:IChannelMember)=>m.user.id!==user.id);
    return (
    <AnimatedOpacity className='lex z-50 w-full h-full bg-white absolute flex-col flex-1 overflow-y-auto transition-opacity opacity-100'>
        <NavigationHeader leading={
            <LinkNavigationButton to={"/chat/channels/"+channel?.id}>
                <TfiArrowLeft/>
            </LinkNavigationButton>
        }>
        </NavigationHeader>
        <div className="flex flex-col flex-1 items-center container bg-white py-2">
            <div className="flex flex-1 w-2/3 flex-col items-stretch pb-40">
                <span className="flex flex-row justify-center">
                    <div className="bg-teal-800 w-40 h-40 rounded-full">
                        <span className="text-lg"></span>
                    </div>
                </span>
                <span className="text-center text-2xl font-bold py-2">
                    {
                        otherMember? `${otherMember.user.firstName} ${otherMember.user.lastName}`
                        : `${user.firstName} ${user.lastName}`
                    }
                </span>
                <div className="p-4 cursor-pointer hover:bg-gray-100 transition-colors border-b-gray-100 border-b-2">
                    Media, Links, and docs
                </div>
                <div className="p-4 cursor-pointer hover:bg-gray-100 transition-colors border-b-gray-100 border-b-2">
                    Disapearing Messages
                </div>
                <div className="p-4 cursor-pointer hover:bg-gray-100 transition-colors border-b-gray-100 border-b-2">
                    Mute Notifications
                </div>
                <div className="p-4 cursor-pointer hover:bg-gray-100 transition-colors border-b-gray-100 border-b-2">
                    Clear Chat
                </div>
                <div className="p-4 cursor-pointer hover:bg-gray-100 transition-colors border-b-gray-100 border-b-2">
                    Export Chat
                </div>
                <div className="p-4 cursor-pointer hover:bg-gray-100 transition-colors border-b-gray-100 border-b-2">
                    Block
                </div>
            </div>
        </div>
    </AnimatedOpacity>);
}
