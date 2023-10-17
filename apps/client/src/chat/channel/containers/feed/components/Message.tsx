import { IMedia, IPartialMedia, IPublicUser, IUser, MediaType } from "@mdm/mdm-core";
import { IFeedMessageMedia } from "../../../slices/channel-feed.model";

export interface IChatMessageProps{
    content:string;
    media?:IFeedMessageMedia;
    sender:IPublicUser|string;
    status:IChatMessageProgress;
    timestamp:string;
    mediaStatus:IChatMessageProgress|undefined;
    onMediaProgressRestart:()=>void,
    onMediaProgressCancel:()=>void,
    type:MessageFlowType;
}

export enum IChatMessageProgress{
    failed,
    pending,
    succeded
}
export enum MessageFlowType{
    sent,
    received
}


export enum Align{
    left="left",
    right = "right"
}

interface IBubbleReduced {
    reduced:boolean;
}

interface IAlignProp {
    align:Align;
}


export function ReceivedMessage(props:IChatMessageProps&IBubbleReduced){
     return (
        <Message {...props}></Message>
    )
}

export function SentMessage(props:IChatMessageProps&IBubbleReduced){
    return (
        <Message {...props}></Message>
    )
}

export function Message(props:IChatMessageProps&IBubbleReduced){
    const {reduced,...rest} = props;

    return (reduced ? 
         <RawReducedMessage {...rest}/>
         :
         <RawMessage {...rest}/>);
}

export default function RawMessage(props:IChatMessageProps){
    const align = props.type === MessageFlowType.sent ? Align.right:Align.left;

    return (
         <MessageWrapper align={align}>
            <MessageAvatar/>
            <MessageBodyWrapper align={align}>
                <MessageHeader align={align}>
                    <span className="text-md font-semibold text-gray-800 dark:text-gray-100">{typeof props.sender === 'string' ? props.sender : `${props.sender.firstName} ${props.sender.lastName}` }</span>
                    <span className="text-xs text-gray-700 dark:text-gray-300 text-opacity-70">{props.timestamp}</span>
                </MessageHeader>
                <MessageContent>
                    {
                        props.media && (
                            <div className={`${props.media.progress && props.media.progress!==1 ? 'blur-sm':''} m-2`}>
                                {
                                    !props.media.id ? 
                                        <MessageContentImage src={props.media.uri}/>
                                        :
                                        <MessageContentImage src={`http://127.0.0.1:3000/api/media/${props.media.id}/download`}/>
                                }
                            </div>
                        )
                    }
                    <MessageLabel>{props.content}</MessageLabel>
                </MessageContent>
            </MessageBodyWrapper>
         </MessageWrapper>
    );
}

export  function RawReducedMessage(props:IChatMessageProps){
     const align = props.type !== MessageFlowType.sent ? Align.right:Align.left;
    return (
        <MessageWrapper align={align}>
            <MessageAvatar className="bg-transparent"></MessageAvatar>
            <MessageBodyWrapper align={Align.right}>
                <MessageContent>
                    {props.content}
                </MessageContent>
            </MessageBodyWrapper>
        </MessageWrapper>
    )
}




function MessageBodyWrapper(props:IAlignProp& React.HTMLProps<HTMLDivElement>){
   return (
     <div className="w-2/3 flex flex-row">
        <div className={`flex flex-col flex-1 items-start
            ${props.align === Align.left? "items-start": "items-end"}
        `}>
            {props.children}
        </div>
    </div>
   );
}


function MessageWrapper(props:IAlignProp& React.HTMLProps<HTMLDivElement>){
    const {align,className,...rest} = props;
    return (
         <div {...rest} className={`flex items-start pt-6 gap-2
            ${align===Align.left? "flex-row":"flex-row-reverse"}`
            }>
           {props.children}
        </div>
    );
}

function MessageAvatar(props:React.HTMLProps<HTMLDivElement>){
    const {className,...rest} = props;
    return (
         <div {...rest} className={`avatar mt-2 flex items-center justify-center  bg-teal-400 text-white mx-2 rounded-full h-12 w-12 ${className} first-letter:
            dark:bg-gray-600
         `}>
                <span className="text-2xl">A</span>
        </div>
    );
}

function MessageContent(props:React.HTMLProps<HTMLDivElement>){
    return (
         <div className="bubble bg-white p-1 rounded-lg break-all dark:bg-slate-800 dark:text-white">
                {props.children}
        </div>
    );
}

function MessageLabel(props:React.HTMLProps<HTMLDivElement>){
  return (
         <div className="px-2 py-1">
                {props.children}
        </div>
    );
}

function MessageContentImage(props:React.HTMLProps<HTMLImageElement>){
    // eslint-disable-next-line jsx-a11y/alt-text
    return <img {...props} className="w-56 z-0 object-cover h-32 rounded-lg"/>;
}

function MessageHeader(props:IAlignProp& React.HTMLProps<HTMLDivElement>){
    return (
         <div className={`py-1 flex items-baseline gap-4
            ${props.align===Align.left ? 'flex-row':"flex-row-reverse"}
         `}>
            {props.children}
        </div>
    );
}

