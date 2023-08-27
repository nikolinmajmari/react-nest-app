// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Routes, Route, Navigate } from "react-router-dom";
import Chat from '../chat';
import { ChannelSettings,ChannelEmpty, ChannelMain } from "../chat";
import { Login } from "../auth/login";
import { SignUp } from "../auth/signup";
import Authenticated from "./components/authenticated";
import { useAppDispatch } from "../app/hooks";
import { attemptSilentSignIn } from "../auth/auth.slice";
import React from "react";
import { useGetCurrentUser } from "../hooks/auth.hooks";

export function App() {
  const dispatch = useAppDispatch();
  const user = useGetCurrentUser();
  React.useEffect(()=>{
    if(!user){
      dispatch(attemptSilentSignIn());
    }
  });
  return (
    <Routes>
      <Route path="/login" element={<Login/>}/>
      <Route path="/signup" element={<SignUp/>}/>
      <Route path='/chat/*' element={<Authenticated><Chat/></Authenticated>}>
        <Route path="channels/:id" element={<ChannelMain/>}>
          <Route path="settings" element={<ChannelSettings/>}/>
        </Route>
        <Route path="*" element={<ChannelEmpty/>}/>
      </Route>
      <Route path="*" element={<Navigate to={"/login"}/>}/>
    </Routes>
  );
}

export default App;
