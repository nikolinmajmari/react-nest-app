import {IFeedMessageMedia} from "../../../slices/channel-feed.model";
import {IUser, MediaType} from "@mdm/mdm-core";
import React from "react";
import 'react-circular-progressbar/dist/styles.css';
import { MessageMediaContent} from "./MediaComponents";
import {Align, IAlignProp, MessageBodyWrapper, MessageContentWrapper, MessageWrapper} from "./Wrappers";
import {MessageAvatar, MessageHeader, MessageTextContent} from "./MessageWidgets";


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

export default function Message(props: IChatMessageProps& IBubbleReduced) {
  const align = props.type === MessageFlowType.sent ? Align.right : Align.left;
  const {reduced}  = props;
  return (
    <MessageWrapper align={align}>
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



export function RawReducedMessage(props: IChatMessageProps) {
  const align = props.type !== MessageFlowType.sent ? Align.right : Align.left;
  return (<MessageWrapper align={align}>
    <MessageAvatar className="bg-transparent"></MessageAvatar>
    <MessageBodyWrapper align={Align.right}>
      <MessageTextContent>
        {props.content}
      </MessageTextContent>
    </MessageBodyWrapper>
  </MessageWrapper>)
}




