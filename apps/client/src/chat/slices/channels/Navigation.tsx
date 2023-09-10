import { useNavigate, useParams } from "react-router-dom";
import { useGetActiveChannel, useGetChannelsList, useGetChannelsStateStatus, useLoadChannelsDispatch, useSetActiveChannel } from "../../../hooks/channels.hooks";
import ChannelSkeleton from "../../components/ChannelsSkeleton";
import ChannelGroupContainer from "../../components/GroupContainer";
import ChatTile from "../../components/Tile";
import React from "react";
import { useSetChannelDispatch } from "../../../hooks/channel.hooks";
import Modal, { ModalContext } from "../../../components/Modal";
import { useGetCurrentUser } from "../../../hooks/auth.hooks";

export default function ChannelsNavigation(){
    const channels = useGetChannelsList();
    const user = useGetCurrentUser();
    const navigate = useNavigate();
    const state = useGetChannelsStateStatus();
    const loadChannels = useLoadChannelsDispatch();
    const setActiveChannel = useSetActiveChannel();
    const setChannel = useSetChannelDispatch();
    const id = useGetActiveChannel();
    const modalContext = React.useContext(ModalContext);
    React.useEffect(()=>{
        if(state==="idle"){
            loadChannels();
        }
    },[state,channels,loadChannels]);

    const showModal = ()=>{
        modalContext.showModal(
            ()=>{
                return (
                    <Modal>
                        This is a modal 
                    </Modal>
                )
            }
        )
    }

    const renderChannels = ()=>{
        return  channels.map((ch)=>{
            const other = ch.members.find(m=>m.user?.id !== user.id)
            if(ch.type==="direct" && other){
                return  <ChatTile
                        avatar={`${other.user.firstName.charAt(0)}${other.user.lastName.charAt(0)}`}
                        active={ch.id===id}
                        label={ch.lastMessage}
                        name={other.user.firstName+' '+other.user.lastName}
                        onClick={showModal}
                        key={ch.id}
                        navigate={
                            ()=>{
                                console.log('navigating',ch.id);
                                setActiveChannel(ch.id);
                                setChannel(ch.id);
                                navigate(`channels/${ch.id}`);
                            }
                        }
                    />
            }
            return (
                <ChatTile
                        avatar="NM"
                        active={ch.id===id}
                        label={ch.lastMessage}
                        name={ch.alias!}
                        onClick={showModal}
                        key={ch.id}
                        navigate={
                            ()=>{
                                console.log('navigating',ch.id);
                                setActiveChannel(ch.id);
                                setChannel(ch.id);
                                navigate(`channels/${ch.id}`);
                            }
                        }
                    />
            )
        });
    }


    return (
        <aside className='flex flex-col flex-1 bg-white'>
            <div className='header py-5 bg-white bg-opacity-20 sticky top-0 backdrop-blur-xl flex flex-row items-center h-25'>
                <input className='flex-1 mx-5 shadow-sm outline-none transition-colors rounded-2xl bg-slate-50 focus:bg-teal-50 focus:shadow-md px-4 py-2'/>
            </div>
             {
                (state==="idle" || state==="loading") 
                && <ChannelSkeleton/>
             }
             {
                state==="succeeded" && 
                <ChannelGroupContainer label="Channels">
                    { renderChannels()}
                </ChannelGroupContainer>
             }
        </aside>
    );
}