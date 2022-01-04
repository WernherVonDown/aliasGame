import React, { useContext, useEffect } from 'react';
import { useSockets } from '../../context/socket.context';
import 'materialize-css/dist/css/materialize.min.css'
import Users from '../Users/Users';
// import '../../index.scss'
import Game from '../Game/Game';
import GameHistory from '../GameHistory/GameHistory';
import styles from '../../app.module.scss'
import Chat from '../Chat/Chat';
import { Switch, Route } from 'react-router-dom'
import { ROOM_EVENTS } from '../../const/room/ROOM_EVENTS';
import { UserContext } from '../../context/user.context';
import { TextInput, Button } from 'react-materialize';
import EnterRoom from '../EnterRoom/EnterRoom';
import { useCookies } from 'react-cookie';
import { USER_COOKIE } from '../../const/user/userCookies';
import { IUser } from '../../const/user/types';
import { ChatContextProvider } from '../../context/chat.context';
import { GameContextProvider } from '../../context/game.context';
import { VideoChatContextProvider } from '../../context/videoChat.context';
import PrepareMediaDevices from '../PrepareMediaDevices/PrepareMediaDevices';
import MainHeader from '../MainHeader/MainHeader';

const Room = (props: any) => {
  const { socket } = useSockets();
  const { state: userState, actions: userActions } = useContext(UserContext)
  const roomId = props.match.params.roomId;
  const [cookies, setCookie] = useCookies([USER_COOKIE.userInfo]);
  console.log('JOIN', roomId)

  useEffect(() => {
    subscribe()

    return () => {
      unsubscribe()
    }
  }, [])

  const onJoinRoom = (data: IUser) => {
    //{userName, roomId: this.roomId, id: socket.id, teamColor}
    // userActions.setUser(data);
    setCookie(USER_COOKIE.userInfo, {
      userName: data.userName,
      roomId: roomId
    });
    console.log('onJoinRoom', data)
  }

  const subscribe = () => {
    socket.on(ROOM_EVENTS.joinRoom, onJoinRoom);
  }

  const unsubscribe = () => {
    socket.off(ROOM_EVENTS.joinRoom, onJoinRoom);
  }

  const gameElements = <GameContextProvider>
    <div>
      <MainHeader />
      <div className={styles.mainPanelWrapper}>
        <GameHistory />
        <div className={styles.centerPanelWrapper}>
          <Game />
          <ChatContextProvider>
            <Chat />
          </ChatContextProvider>
        </div>
        <Users />
      </div>
    </div>

  </GameContextProvider>

  const prepareDeviceElements = <GameContextProvider>
    <PrepareMediaDevices />
  </GameContextProvider>

  let elements = true ? gameElements : prepareDeviceElements;

  if (!userState.userName)
    elements = <EnterRoom roomId={roomId} />

  return (
    <div className={styles.content}>
      <VideoChatContextProvider>
        {elements}
      </VideoChatContextProvider>
    </div>
  );
}

export default Room;
