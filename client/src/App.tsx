import React, { useContext, useEffect } from 'react';
import { useSockets } from './context/socket.context';
import 'materialize-css/dist/css/materialize.min.css'
import Users from './components/Users/Users';
import './index.scss'
import Game from './components/Game/Game';
import GameHistory from './components/GameHistory/GameHistory';
import styles from './app.module.scss'
import Chat from './components/Chat/Chat';
import CreateGame from './components/CreateGame/CreateGame';
import { Switch, Route } from 'react-router-dom'
import Room from './components/Room/Room';
import { VideoChatContextProvider } from './context/videoChat.context';
import Login from './components/Login/Login';
import Registration from './components/Registration/Registration';

const App = () => {
  // const { socket } = useSockets();

  useEffect(() => {
    // socket.emit('hello', 123)
  })

  return <Switch>
    <Route exact path='/' component={CreateGame} />
    <Route exact path='/login' component={Login} />
    <Route exact path='/registration' component={Registration} />
    
    {/* <VideoChatContextProvider> */}
      <Route path='/room/:roomId' component={Room} />
    {/* </VideoChatContextProvider> */}
  </Switch>

  // return (
  //   <div className={styles.content}>
  //     <CreateGame />
  //   </div>
  // );

  return (
    <div className={styles.content}>
      <Users />
      <div className={styles.mainPanelWrapper}>
        <GameHistory />
        <div className={styles.centerPanelWrapper}>
          <Game />
          <Chat />
        </div>
      </div>
    </div>
  );
}

export default App;
