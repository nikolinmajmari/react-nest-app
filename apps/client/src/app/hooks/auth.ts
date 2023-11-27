import { IUser } from "@mdm/mdm-core";
import { useAppDispatch,useAppSelector } from ".";
import {IAuthState, LoginCredentials} from "../../auth/auth.model";
import loginThunk from "../../auth/thunks/signInThunk";
import { useCallback } from "react";


export function useCurrentUser():IUser{
    return useAppSelector(root=>root.auth.user);
}

export function useAuth():IAuthState{
  return useAppSelector(root=>root.auth);
}

export function useAuthStatus(){
    return useAppSelector(root=>root.auth.status);
}

export function useDispatchSignIn(){
    const dispatch = useAppDispatch();
    return useCallback(
        function(payload:LoginCredentials){
            return dispatch(loginThunk(payload));
        },
        [dispatch]
    )
}
