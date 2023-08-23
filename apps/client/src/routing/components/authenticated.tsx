import { Navigate } from "react-router-dom";
import { useGetCurrentUser } from "../../hooks/auth.hooks";

export default function Authenticated(props:any){
    const user = useGetCurrentUser();
    if(!user){
        return <Navigate to={"/login"}/>
    };
    return (
        <>
        {null}
       {props.children}
        </>
    );
}