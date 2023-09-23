import { useGetChannel } from "../../../hooks/channel.hooks";
import { LinkNavigationButton, NavigationButton } from "../../../components/channels/default";
import { NavigationHeader } from "../../../components/channels/NavigationHeader";
import { TfiCamera, TfiHeadphone, TfiMenu } from "react-icons/tfi";
import { useGetCurrentUser } from "../../../hooks/auth.hooks";

export default function ChannelNavigation(){
    const channel = useGetChannel();
    const user = useGetCurrentUser();
    
    return (
        <NavigationHeader
            leading={
                <label className="px-12">{}</label>
            }
        >
            <NavigationButton>
                 <TfiHeadphone/>
            </NavigationButton>
             <NavigationButton>
                  <TfiCamera/>
            </NavigationButton>
            <LinkNavigationButton to={"settings"}>
                <TfiMenu/>
            </LinkNavigationButton>
        </NavigationHeader>
    )
}