import React from "react"
import { Button, TextInput, Icon } from "react-materialize";
import MessagesList from "./MessagesList";
import styles from './Chat.module.scss';
import useInput from '../../hooks/useInput';
import { useContext } from 'react';
import { ChatContext } from "../../context/chat.context";
import useForceUpdate from '../../hooks/useForceUpdate';
import { useRef } from "react";
import { useEffect } from "react";
import { FormSelect } from "materialize-css";

const Chat = () => {
    const message = useInput('');
    const forceUpdate = useForceUpdate()

    const { actions: chatActions } = useContext(ChatContext);

    const sendMessage = () => {
        chatActions.sendMessage(message.value);
        console.log('EEEE', message)
        message.clear()
    }

    const handleKeyDown = (e: any)=> {
        if(e.key == 'Enter') {
            console.log('AAAAAAAAAa', message.value)
            sendMessage()
        }
    }
 
    return <div className={styles.chatWrapper}>
        <MessagesList />
        <div className={styles.chatInputWrapper}>
        <div className="input-field col s6">
          <input {...message} id="first_name" onKeyDown={handleKeyDown} type="text" className=""/>
          <label htmlFor="first_name"> Введите сообщение</label>
        </div>
            <Button onClick={sendMessage}>
                Отправить
            </Button>
        </div>
    </div>
}

export default Chat;