import {useAuthStatus} from "../app/hooks/auth";
import {Navigate} from 'react-router';
import React from "react";
import {useNavigate} from "react-router-dom";

export default function RequireAuthProvider(props:any){
  const status = useAuthStatus();
  const navigate = useNavigate();
  React.useEffect(()=>{
    if(status==='failed'){
      navigate('/auth/login');
    }
  },[status]);
  if(status==='idle'){
    return <>loading</>;
  }
  if(status==='loading'){
    return <>loading</>;
  }
  if(status==='failed'){
    return <div>failed</div>;
  }
  console.log('status');
  return (<>
    {props.children}
  </>)
}
