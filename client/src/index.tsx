import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import SocketsProvider from './context/socket.context';
import { BrowserRouter } from 'react-router-dom';
import { UserContextProvider } from './context/user.context';
import { UsersContextProvider } from './context/users.context';
import { CookiesProvider } from 'react-cookie';
import { AuthContextProvider } from './context/auth.context';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <CookiesProvider>
        <AuthContextProvider>
          <SocketsProvider>
            <UserContextProvider>
              <UsersContextProvider>
                <App />
              </UsersContextProvider>
            </UserContextProvider>
          </SocketsProvider>
        </AuthContextProvider>
      </CookiesProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
