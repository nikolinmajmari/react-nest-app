import {IFeedMessage, IFeedMessageMedia} from "../../slices/channel-feed.model";
import {IMessage, IPartialUser, IUser, MediaType} from "@mdm/mdm-core";
import React from "react";
import 'react-circular-progressbar/dist/styles.css';
import { MessageMediaContent} from "./MediaComponents";
import {Align, MessageBodyWrapper, MessageContentWrapper, MessageWrapper} from "./Wrappers";
import {EmptyMessageAvatar, MessageAvatar, MessageHeader, MessageTextContent} from "./MessageWidgets";
import {useLongPress} from "use-long-press";
import {SelectedContext} from "../../../../providers/SelectedContextProvider";
import SelectedOverlay from "./SelectedOverlay";
import {useAbortMediaProgress} from "../../slices/hooks/feed";


export interface IChatMessageProps {
  content: string,
  id:string,
  sender: IUser,
  timestamp: string;
  children?: React.ReactNode,
  align: Align;
}

export enum MessageFlowType {
  sent, received
}


interface IBubbleReduced {
  reduced: boolean;
}

export default function Message(props: IChatMessageProps & IBubbleReduced ) {
  const {reduced,content,sender,id,align,timestamp}  = props;
  const selection = React.useContext(SelectedContext);
  const toggleSelect = React.useCallback(()=>selection.toggle(id),[
    id,selection
  ]);
  const bind = useLongPress(toggleSelect);
  return (
    <MessageWrapper align={align}
                    className={'relative'}
                    reduced={reduced}
                    {...bind()}
                    onMouseDown={()=>{
                      if(selection.selected.length!==0){
                        selection.toggle(id)
                      }
                    }}
    >
      {
        selection && selection.isSelected(id) &&
                      <SelectedOverlay onMouseDown={
                        (e)=>{
                          selection.unSelect(id!);
                        }
                      }/>
      }
      {
        !reduced ?
          <MessageAvatar>
            {`${sender.firstName[0]}${sender.lastName[0]}`}
          </MessageAvatar>
          :
          <EmptyMessageAvatar/>
      }
      <MessageBodyWrapper align={align}>
        { !reduced && ( <MessageHeader align={align} sender={sender} timestamp={timestamp}/>) }
        <MessageContentWrapper>
          { props.children }
          <MessageTextContent>{content}</MessageTextContent>
        </MessageContentWrapper>
      </MessageBodyWrapper>
  </MessageWrapper>
  );
}



