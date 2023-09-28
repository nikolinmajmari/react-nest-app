export interface IAsyncRenderProps{
    status:"idle"|"success"|"failed"|"loading";
    failed:React.ReactNode;
    loading: React.ReactNode;
    success:React.ReactNode;
    children?:React.ReactNode;
}

export default function AsyncRender(props:IAsyncRenderProps){
    switch(props.status){
        case "failed":
            return props.failed;
        case "loading":
            return props.loading;
        case "success":
            return props.success;
    }
    return (props.children);
}