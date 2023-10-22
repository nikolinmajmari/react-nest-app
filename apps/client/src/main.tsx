import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import {BrowserRouter, RouterProvider} from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import App from './routing/app';
import store from './app/store';
import { Provider } from 'react-redux'
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <StrictMode>
   <Provider store={store}>
      <App />
   </Provider>
  </StrictMode>
);
