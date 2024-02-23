import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import 'react-toastify/dist/ReactToastify.css';
import App from './routing/app';
import store from './app/store';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Provider } from 'react-redux'
import ThemeProvider from "./providers/ThemeProvider";
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <StrictMode>
   <Provider store={store}>
     <ThemeProvider>
       <GoogleOAuthProvider clientId={"621562990315-8eiq3p7i1l3962ni1cdgvr6d1d563qke.apps.googleusercontent.com"}
       >
         <App />
       </GoogleOAuthProvider>
     </ThemeProvider>
   </Provider>
  </StrictMode>
);
