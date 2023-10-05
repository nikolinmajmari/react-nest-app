// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Chat, { ChannelContainer } from '../chat';
import { Login } from "../auth/login";
import { SignUp } from "../auth/signup";
import { useAppDispatch } from "../app/hooks";
import { attemptSilentSignIn } from "../auth/auth.slice";
import React from "react";
import { useCurrentUser } from "../app/hooks/auth";
import ChannelEmpty from "../components/channels/ChannelEmpty";
import { ContextMenuProvider } from "../components/menu/ContextMenu";
import NewChannelModal from "../chat/channels/containers/new/NewChannelModal";
import NewChannelTypeModal from "../chat/channels/containers/new/NewChannelTypeSelectModal";
import SettingsNavigator from "../chat/channel/containers/settings";
import NotificationProvider from "../components/notifications/Toastify";
import NavigationContainer from "./components/Navigation";
import ChannelMembers from "../chat/channel/containers/settings/ChannelMembers";
import ChannelSettings from "../chat/channel/containers/settings/ChannelSettings";

export function App() {
  const dispatch = useAppDispatch();
  const user = useCurrentUser();
  React.useEffect(()=>{
    if(!user){
      dispatch(attemptSilentSignIn());
    }
  });
  const location = useLocation();
  const previousLocation = location.state?.previousLocation;
  return (
    <NotificationProvider>
      <ContextMenuProvider>
        <Routes location={previousLocation || location}>

        <Route path="/auth/*">
          <Route path="login" element={<Login/>}/>
          <Route path="signup" element={<SignUp/>}/>
        </Route>

        <Route path="/chat/*" element={<NavigationContainer/>}>

          <Route path='channels' element={<Chat/>}>
            <Route path=":id" element={<ChannelContainer/>}>
              <Route path="settings" element={<SettingsNavigator/>}>
                <Route path="members" element={<ChannelMembers/>}/>
                <Route path="*" element={<ChannelSettings/>}/>
              </Route>
            </Route>
             <Route path="*" element={<ChannelEmpty/>}/>
          </Route>

          <Route path='calls' element={<div>Calls</div>}>
            <Route path="*" element={<div>Calls</div>}/>
            </Route>
          </Route>

        <Route path="*" element={<Navigate to={'/auth/login'}></Navigate>}/>
        </Routes>
        {
          previousLocation && 
          <Routes>
            <Route path="/chat/channels/new" element={<NewChannelTypeModal/>}></Route>
            <Route path="/chat/channels/private/new" 
              element={<NewChannelModal title="Create new Private Channel" type="private"/>}>
            </Route>
            <Route path="/chat/channels/group/new" 
              element={<NewChannelModal title="Create new Group Channel" type="group"/>}>
            </Route>
          </Routes>
        }
    </ContextMenuProvider>
    </NotificationProvider>
  );
}

export default App;
