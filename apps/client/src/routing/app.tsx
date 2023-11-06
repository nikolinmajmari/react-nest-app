// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {createBrowserRouter, Navigate, Route, RouterProvider, Routes, useLocation} from "react-router-dom";
import Chat, {ChannelContainer} from '../chat';
import {Login} from "../auth/login";
import {SignUp} from "../auth/signup";
import {useAppDispatch} from "../app/hooks";
import {attemptSilentSignIn} from "../auth/auth.slice";
import React from "react";
import {useCurrentUser} from "../app/hooks/auth";
import ChannelEmpty from "../chat/channel/ChannelEmpty";
import {ContextMenuProvider} from "../components/menu/ContextMenu";
import NewChannelModal from "../chat/channels/new/NewChannelModal";
import NewChannelTypeModal from "../chat/channels/new/NewChannelTypeSelectModal";
import SettingsNavigator from "../chat/channel/settings/SettingsNavigation";
import ToastNotificationProvider from "../providers/ToastNotificationProvider";
import NavigationContainer from "./components/Navigation";
import ChannelMembers from "../chat/channel/settings/ChannelMembers";
import ChannelSettings from "../chat/channel/settings/ChannelSettings";
import {ChannelType} from "@mdm/mdm-core";
import NotFound from "./pages/NotFound";
import MediaNavigator from "../chat/channel/media/Navigator";
import MediaGallery from "../chat/channel/media/Galery";
import MediaDocuments from "../chat/channel/media/Documents";
import MediaLinks from "../chat/channel/media/Links";
import ChannelDetailsNavigation from "../chat/channel/ChannelDetailsNavigation";

function Root(){
  const location = useLocation();
  const previousLocation = location.state?.previousLocation;
  return (
    <>
      <Routes location={previousLocation || location}>
        <Route path="/auth/*">
          <Route path="login" element={<Login/>}/>
          <Route path="signup" element={<SignUp/>}/>
        </Route>

        <Route path="/chat" element={<NavigationContainer/>}>
          <Route path='channels' element={<Chat/>}>
            <Route path=":channel" element={<ChannelContainer/>}>
              <Route element={<ChannelDetailsNavigation/>}>
                <Route path="settings" element={<SettingsNavigator/>}>
                  <Route path="members" element={<ChannelMembers/>}/>
                  <Route path="" element={<ChannelSettings/>}/>
                </Route>
                <Route path="media" element={<MediaNavigator/>}>
                  <Route path="docs" element={<MediaDocuments/>}/>
                  <Route path="links" element={<MediaLinks/>}/>
                  <Route path="" element={<MediaGallery/>}/>
                </Route>
              </Route>
            </Route>
            <Route path="" element={<ChannelEmpty/>}/>
          </Route>
          <Route path='calls' element={<div>Calls</div>}>
            <Route path="*" element={<div>Calls</div>}/>
          </Route>
          <Route path={"*"} element={<NotFound label={'Channels'}/>}/>
        </Route>
        <Route path={"*"} element={<NotFound label={'Log In'} location={'/auth/login'}/>}/>
      </Routes>
      {
        previousLocation &&
        <Routes>
          <Route path="/chat/channels/new" element={<NewChannelTypeModal/>}></Route>
          <Route path="/chat/channels/private/new"
                 element={<NewChannelModal title="Create new Private Channel"
                                           type={ChannelType.private}/>}

          >
          </Route>
          <Route path="/chat/channels/group/new"
                 element={<NewChannelModal title="Create new Group Channel" type={ChannelType.group}/>}
          >
          </Route>
        </Routes>
      }
    </>
  );
}

const router = createBrowserRouter([
  {
    path:'*',
    Component:Root
  }
]);
export function App() {
  const dispatch = useAppDispatch();
  const user = useCurrentUser();
  React.useEffect(()=>{
    if(!user){
      dispatch(attemptSilentSignIn());
    }
  });
  return (
    <ToastNotificationProvider>
      <ContextMenuProvider>
       <RouterProvider router={router}/>
    </ContextMenuProvider>
    </ToastNotificationProvider>
  );
}

export default App;
