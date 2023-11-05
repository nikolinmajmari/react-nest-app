import { Navigate } from "react-router-dom";
import {useAuthStatus, useCurrentUser} from "../../app/hooks/auth";
export default function Authenticated(props:any){
    const user = useCurrentUser();
    const state = useAuthStatus();
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
