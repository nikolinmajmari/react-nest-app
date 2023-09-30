
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

export interface IMessageProps extends React.HTMLProps<HTMLDivElement>{
    content: string;
    type?:"text";
    sender:string,
    timestamp:string,
}

export function ReceivedMessage(props:IMessageProps&IBubbleReduced){
     return (
        <Message align={Align.left} {...props}></Message>
    )
}

export function SentMessage(props:IMessageProps&IBubbleReduced){
    return (
        <Message align={Align.right} {...props}></Message>
    )
}

export function Message(props:IMessageProps&IBubbleReduced&IAlignProp){
    const {reduced,...rest} = props;

    return (reduced ? 
         <RawReducedMessage {...rest}/>
         :
         <RawMessage {...rest}/>);
}

export default function RawMessage(props:IMessageProps&IAlignProp){
    const {align,content,sender,timestamp} = props;
    return (
         <MessageWrapper align={align}>
            <MessageAvatar/>
            <MessageBodyWrapper align={align}>
                <MessageHeader align={align}>
                    <span className="text-md font-semibold text-gray-800 dark:text-gray-100">{sender}</span>
                    <span className="text-xs text-gray-700 dark:text-gray-300 text-opacity-70">{timestamp.slice(0,10)}</span>
                </MessageHeader>
               <MessageContent>
                 {content}
               </MessageContent>
            </MessageBodyWrapper>
         </MessageWrapper>
    );
}

export  function RawReducedMessage(props:IMessageProps&IAlignProp){
    return (
        <MessageWrapper align={props.align}>
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
         <div className="bubble bg-white px-4 py-3 rounded-2xl break-all dark:bg-slate-800 dark:text-white">
                {props.children}
        </div>
    );
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

