import ChannelMessagesSkeleton from "../messages/MessagesSkeleton";
import { NavigationHeader } from "./NavigationHeader";

export function ChannelSkeleton(){
    return (
        <div className="absolute bg-gray-600 z-10 w-full h-full flex flex-col flex-1 overflow-hidden">
            <NavigationHeader/>
            <ChannelMessagesSkeleton/>
        </div>
    );
}