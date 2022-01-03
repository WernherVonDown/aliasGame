import React, { useContext, useEffect, useState } from 'react';
import { useSockets } from '../../context/socket.context';
import 'materialize-css/dist/css/materialize.min.css'
import appStyles from '../../app.module.scss'
import { ROOM_EVENTS } from '../../const/room/ROOM_EVENTS';
import { UserContext } from '../../context/user.context';
import { TextInput, Button } from 'react-materialize';
import styles from './EnterRoom.module.scss'
import useInput from '../../hooks/useInput';
import { useCookies } from 'react-cookie';
import { USER_COOKIE } from '../../const/user/userCookies';
import { IEnterRoom } from '../../const/room/types';
import { GameContextProvider } from '../../context/game.context';
import PrepareMediaDevices from '../PrepareMediaDevices/PrepareMediaDevices';
import { VideoChatContextProvider } from '../../context/videoChat.context';

interface IProps {
    roomId: string
}


const EnterRoom = ({ roomId }: IProps) => {
    const { socket } = useSockets();
    const [cookies, setCookie] = useCookies([USER_COOKIE.userInfo]);
    const userName = useInput(cookies[USER_COOKIE.userInfo]?.userName || '')
    const [showSelectDevices, setShowSelectDevices] = useState<boolean>(false);

    console.log('COOKIE', cookies)

    useEffect(() => {
        console.log('EEE', cookies[USER_COOKIE.userInfo]?.roomId, roomId)
        if (cookies[USER_COOKIE.userInfo]?.userName?.length && cookies[USER_COOKIE.userInfo]?.roomId === roomId) {
            // sendUserData({
            //     roomId: cookies[USER_COOKIE.userInfo].roomId,
            //     userName: cookies[USER_COOKIE.userInfo].userName
            // })
        }
    }, [])

    const sendUserData = ({ roomId, userName }: IEnterRoom) => {
        console.log('SEND', { roomId, userName })
        socket.emit(ROOM_EVENTS.joinRoom, { roomId, userName })
    }

    const setUserName = () => {
        if (userName.value.length) {
            // console.log('setUserName', userName.value)
            //setShowSelectDevices(true)
            sendUserData({ roomId, userName: userName.value })
        }
    }

    const onDeviceSet = () => {
        if (userName.value.length) {
            console.log('setUserName', { roomId, userName: userName.value })
            sendUserData({ roomId, userName: userName.value })
        }
    }

    if (showSelectDevices) {
        return <PrepareMediaDevices onDeviceSet={onDeviceSet} />
    }

    return <div className={appStyles.content}>
        <div className={styles.enterRoomWrapper}>
            Введите имя
            <TextInput
                id="TextInput-50"
                label="Ваше имя"
                inputClassName={appStyles.input}
                noLayout
                {...userName}
            />
            <Button onClick={setUserName}>
                Отправить
            </Button>
        </div>
    </div>
}

export default EnterRoom;
