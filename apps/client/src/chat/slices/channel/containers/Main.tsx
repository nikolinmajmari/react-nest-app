import React from "react";
import { useSpringOpacity } from "../../../../hooks/springs.hooks";
import { TfiCamera, TfiHeadphone, TfiMenu } from "react-icons/tfi";
import {  Outlet, useParams } from "react-router-dom";
import { animated } from '@react-spring/web';
import { useGetChannelId, useGetChannelStateStatus, useLoadChannelDispatch, useSetChannelDispatch } from "../../../../hooks/channel.hooks";
import ChannelMessagesSkeleton from "../../../components/messages/MessagesSkeleton";
import { LinkNavigationButton, NavigationButton } from "../../../components/channel/default";
import { NavigationHeader } from "../../../components/channel/NavigationHeader";
import  Entry  from "./Entry";
import Messages from "./Messages";


export default function Main(){
    // data
    const ref = React.useRef<HTMLDivElement>(null);
    const {id} = useParams();
    const status = useGetChannelStateStatus();
    const stateChannelId = useGetChannelId();
    const springs = useSpringOpacity();

    // mutations  
    const setMainChannel = useSetChannelDispatch();
    const loadChannel = useLoadChannelDispatch();

    // effects 
    React.useEffect(()=>{
        let promise:any;
        if( id && (status==="idle" || parseInt(id)=== stateChannelId)){
             promise = loadChannel(parseInt(id));
             setMainChannel(parseInt(id));
        }
        return ()=>(promise && promise.abort())
    },[id]);
    return (<>
    <animated.main style={{...springs}} 
        className={'flex flex-col flex-1 overflow-y-auto transition-opacity opacity-100'}>
        <ChannelNavigation />
        { (status==="idle"|| status==="loading") && <ChannelMessagesSkeleton/> }
        { (status === "succeeded") &&  <Messages ref={ref}/>}
        <Entry ref={ref}/>
    </animated.main>
    <Outlet/>
    </>);
}


function ChannelNavigation(){
    return (
        <NavigationHeader>
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