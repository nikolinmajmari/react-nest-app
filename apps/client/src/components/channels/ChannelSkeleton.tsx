import ChannelMessagesSkeleton from "../messages/MessagesSkeleton";
import { NavigationHeader } from "./NavigationHeader";

export function ChannelSkeleton(){
    return (
        <div className="flex flex-col flex-1 overflow-hidden">
            <NavigationHeader/>
            <ChannelMessagesSkeleton/>
        </div>
    );
}