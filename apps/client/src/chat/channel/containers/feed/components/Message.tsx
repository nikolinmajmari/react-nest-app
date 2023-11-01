import {IFeedMessageMedia} from "../../../slices/channel-feed.model";
import {IUser, MediaType} from "@mdm/mdm-core";
import React from "react";
import 'react-circular-progressbar/dist/styles.css';
import { MessageMediaContent} from "./MediaComponents";
import {Align, MessageBodyWrapper, MessageContentWrapper, MessageWrapper} from "./Wrappers";
import {MessageAvatar, MessageHeader, MessageTextContent} from "./MessageWidgets";
import {useLongPress} from "use-long-press";


export interface IChatMessageProps {
  content: string;
  media?: IFeedMessageMedia;
  sender: IUser;
  status: IChatMessageProgress;
  timestamp: string;
  mediaStatus: IChatMessageProgress | undefined;
  onMediaProgressRestart: () => void,
  onMediaProgressCancel: () => void,
  type: MessageFlowType;
  selected:boolean;
  selectionMode:boolean;
  toggleSelect:()=>void;
}

export enum IChatMessageProgress {
  failed, pending, succeded
}

export enum MessageFlowType {
  sent, received
}


interface IBubbleReduced {
  reduced: boolean;
}


export function ReceivedMessage(props: IChatMessageProps & IBubbleReduced) {
  return (<Message {...props}></Message>)
}

export function SentMessage(props: IChatMessageProps & IBubbleReduced) {
  return (<Message {...props}></Message>)
}

export default function Message(props: IChatMessageProps& IBubbleReduced & ISelectionProps) {
  const align = props.type === MessageFlowType.sent ? Align.right : Align.left;
  const {reduced}  = props;
  const bind = useLongPress(props.toggleSelect);
  return (
    <MessageWrapper align={align}
                    className={'relative'}
                    {...bind()}
    >
      <SelectedOverlay selected={props.selected}
                       selectionMode={props.selectionMode}
                       toggleSelect={props.toggleSelect}
                       />
      <MessageAvatar className={reduced ? 'bg-transparent':''}/>
      <MessageBodyWrapper align={align}>
        {
          !reduced && (
            <MessageHeader align={align}
                           sender={props.sender}
                           timestamp={props.timestamp}
            />
          )
        }
        <MessageContentWrapper>
          {props.media && (
            <MessageMediaContent restartProgress={props.onMediaProgressRestart}
                          cancelProgress={props.onMediaProgressCancel}
                          media={props.media}/>)}
          <MessageTextContent>{props.content}</MessageTextContent>
        </MessageContentWrapper>
      </MessageBodyWrapper>
  </MessageWrapper>);
}


export interface ISelectionProps{
  selected:boolean;
  selectionMode:boolean;
  toggleSelect:()=>void;
}
export function SelectedOverlay(props:ISelectionProps){
  return (
    <>
      {
        props.selectionMode && (
          <div onClick={props.toggleSelect}
               className={'absolute rounded-lg cursor-pointer z-10 w-full h-full' +
                 ' cursor-pointer ' +
                 (props.selected ? 'bg-opacity-50 bg-gray-800':'')
               }
          >
          </div>
        )
      }
    </>
  );
}



