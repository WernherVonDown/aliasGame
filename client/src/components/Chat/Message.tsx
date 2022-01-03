import React from "react"
import { IMessage } from '../../const/textChat/types';
import styles from './Chat.module.scss';
import classNames from 'classnames';

type IProps = IMessage | any;
const Message = (props: IProps) => {
    const { text, from, isMe } = props;

    return <div className={classNames(styles.chatMessage, {[styles.myMessage]: isMe})}>
        <div className={styles.messageFrom}>{from}</div>
        <div className={styles.messageText}>{text}</div>
    </div>
}

export default Message;