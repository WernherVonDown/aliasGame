import React, { ReactElement, useContext, useState, useEffect } from "react";
import { useSockets } from './socket.context';
import { USER_EVENTS } from '../const/user/USER_EVENTS';
import { ROOM_EVENTS } from '../const/room/ROOM_EVENTS';
import { IUser } from '../const/user/types';
import useForceUpdate from "../hooks/useForceUpdate";
import { HTTP_EVENTS } from "../const/https/HTTP_EVENTS";
import axios from 'axios';

interface IState {
    userName: string;
    id: string;
    score: number;
    maxScore: number;
    teamColor?: string;
    active: boolean;
    deviceSet: boolean;
    localStream: MediaStream;
    customWords: any[]
}

interface ContextValue {
    state: IState,
    actions: {
        [key: string]: (...args: any[]) => any
    }
}

interface IProps {
    state: IState,
    children: ReactElement | ReactElement[]
}

const UserContext = React.createContext({} as ContextValue);

const UserContextProvider = (props: IProps) => {
    const { children, state: defaultState } = props;
    const [state, setState] = useState<IState>(defaultState);
    const { socket } = useSockets();
    const forceUpdate = useForceUpdate()

    const setUser = (data: IUser) => {
        console.log("EEHEHEHEHHEHEHE", data)
        setState((p: IState) => {
            // forceUpdate()
            return {
                ...p,
                ...data
            }
        })
        
    }

    const getCustomWords = async () => {
        try {
            const res = await axios.post(HTTP_EVENTS.getWords);
            console.log('RES getCustomWords', res)
            if (res.data.success) {
                setState(p => ({
                    ...p,
                    customWords: res.data.wordsList || []
                }))
            }
        } catch (error) {
            console.log('getCustomWords error', error)
        }
    }

    const addCustomWords = async (data: any) => {
        try {
            const res = await axios.post(HTTP_EVENTS.addWords, data);
            console.log('addCustomWords res', res)
        } catch (error) {
            console.log('addCustomWords error', error)
        }
    }

    const getState = () => state;

    const devicesSet = () => {
        console.log('Device set')
        setState((p: IState) => {
            return {
                ...p,
                deviceSet: true
            }
        })
    }

    const setLocalStream = (stream: MediaStream) => {
        console.log('SET LOCAL STREAM EE', stream)
        setState((p: IState) => {
            return {
                ...p,
                localStream: stream
            }
        })
    }

    useEffect(() => {
        socket.on(USER_EVENTS.userChanged, setUser);
        socket.on(ROOM_EVENTS.joinRoom, setUser);
    }, []);

    const actions = {
        setUser,
        devicesSet,
        setLocalStream,
        getState,
        getCustomWords,
        addCustomWords
    }

    return <UserContext.Provider
        value={{
            state,
            actions
        }}
    >
        {children}
    </UserContext.Provider>
}

UserContextProvider.defaultProps = {
    state: {
        userName: '',
        id: '',
        score: 0,
        maxScore: 0,
        color: '',
        deviceSet: false,
        customWords: []
    }
}

export { UserContext, UserContextProvider };