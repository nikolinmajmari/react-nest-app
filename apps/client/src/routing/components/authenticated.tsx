import { Navigate } from "react-router-dom";
import { useGetAuthStateStatus, useGetCurrentUser } from "../../core/hooks/auth.hooks";

export default function Authenticated(props:any){
    const user = useGetCurrentUser();
    const state = useGetAuthStateStatus();
    if(!user && state!=="loading"){
        return <Navigate to={"/login"}/>
    };
    return (
        <>
        {null}
       {props.children}
        </>
    );
}
