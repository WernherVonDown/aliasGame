import React, { useRef, useEffect } from "react"
import { IMessage } from '../../const/textChat/types';
import Message from './Message';
import styles from './Chat.module.scss';
import { useContext } from 'react';
import { ChatContext } from "../../context/chat.context";

const MessagesList = () => {
    const { state: { messages } } = useContext(ChatContext)

    const messagesEndRef = useRef<null | HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
      }
    
      useEffect(() => {
        scrollToBottom()
      }, [messages]);

    return <div className={styles.chatMessageList}>
        {messages.map(({ from, text, isMe }: IMessage | any, id: number) => (
            <Message key={id + '_message'} from={from} text={text} isMe={isMe} />
        ))}
         <div ref={messagesEndRef} />
    </div>
}

export default MessagesList;