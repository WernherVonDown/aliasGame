import React, { ReactElement, useState, useCallback, useEffect } from "react";
import { IMessage } from '../const/textChat/types';
import { TEXT_CHAT_EVENTS } from '../const/textChat/TEXT_CHAT_EVENTS';
import { useSockets } from './socket.context';
import { useContext } from 'react';
import { UserContext } from "./user.context";

interface IState {
    messages: IMessage[]
}

interface IProps {
    state: IState,
    children: ReactElement | ReactElement[]
}

interface ContextValue {
    state: IState,
    actions: {
        [key: string]: (...args: any[]) => unknown
    }
}

const ChatContext = React.createContext({} as ContextValue);

const ChatContextProvider = (props: IProps) => {
    const { children, state: defaultState } = props;
    const [state, setState] = useState<IState>(defaultState);
    const {socket} = useSockets();
    const {state: userState} = useContext(UserContext);

    const receiveMessage = useCallback((message: IMessage) => {
        console.log('receiveMessage', message)
        setState((p: IState) => {
            message.isMe = userState.id === message.id;
            const messages = [...p.messages, message]
            return {
                ...p,
                messages
            }
        })
    }, [])

    const sendMessage = useCallback((text: string) => {
        if (text.length) {
            const message = {
                userName: userState.userName,
                id: userState.id,
                text,
            }

            socket.emit(TEXT_CHAT_EVENTS.sendMessage, message);
            receiveMessage(message);
        }
    }, [])

    useEffect(() => {
        socket.on(TEXT_CHAT_EVENTS.sendMessage, receiveMessage);
    }, [])



    const actions = {
        sendMessage
    }

    return <ChatContext.Provider
                value={{
                    state,
                    actions
                }}
            >
                {children}
            </ChatContext.Provider>
}

ChatContextProvider.defaultProps = {
    state: {
        messages: []
    },
}

export { ChatContext, ChatContextProvider};