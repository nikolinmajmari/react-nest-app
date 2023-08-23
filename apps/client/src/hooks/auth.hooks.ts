import { useAppDispatch, useAppSelector } from "../app/hooks";
import { LoginCredentials } from "../auth/auth.model";
import loginThunk from "../auth/thunks/signInThunk";

export function useGetCurrentUser(){
    return useAppSelector(root=>root.auth.user);
}

export function useGetAuthStateStatus(){
    return useAppSelector(root=>root.auth.status);
}


export function useSignInAppDispatch(){
    const dispatch = useAppDispatch();
    return (payload:LoginCredentials)=>{
        return dispatch(loginThunk(payload));
    }
}