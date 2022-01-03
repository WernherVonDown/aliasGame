import React, { ReactElement, useState, useCallback, useEffect } from "react";
import { IUser } from '../const/user/types';
import { useSockets } from './socket.context';
import { ROOM_EVENTS } from '../const/room/ROOM_EVENTS';
import { useContext } from 'react';
import { VideoChatContext } from "./videoChat.context";
import { UserContext } from "./user.context";

interface IState {
    users: IUser[]
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

const UsersContext = React.createContext({} as ContextValue);

const UsersContextProvider = (props: IProps) => {
    const { children, state: defaultState } = props;
    const [state, setState] = useState<IState>(defaultState);
    const {state: userState, actions: userActions} = useContext(UserContext)
    const { socket } = useSockets();


    const userJoin = useCallback((user: IUser) => {

        // videoChatActions.startCall(user.id);
        // setState((p: IState) => {
        //     let users = p.users;
        //     if (!p.users.find((u: IUser) => u.id === user.id)) {
        //         users = [...p.users, user]
        //     }
        //     return {
        //         ...p,
        //         users
        //     }
        // })
    }, [])

    const userLeave = useCallback((user: IUser) => {
        setState((p: IState) => {
            return {
                ...p,
                users: p.users.filter(e => e.id !== user.id)
            }
        })
    }, [])

    const setStream = useCallback(({ userId, stream }: { userId: string, stream: MediaStream }) => {
        console.log('setStream', { userId, stream })
        let result = true;
        setState((p: IState) => {
            let users = [...p.users];
            console.log('USERS', users)
            const userIndex = users.findIndex(({ id }) => id === userId);
            if (~userIndex) {
                users[userIndex].stream = stream
            } else result = false;

            console.log('+++ new users', users, userId, userIndex)

            return {
                ...p,
                users
            }
        })
        return result;
    }, [])

    const usersData = useCallback((users: IUser[]) => {
        console.log('usersData', users, userState, userActions.getState())
        setState((p: IState) => {
            const oldUsers = [...p.users]
            oldUsers.forEach((u) => {
                if (u.stream) {
                    const uid = users.findIndex(({id}) => id === u.id)
                    if (~uid) {
                        users[uid].stream = u.stream;
                    }
                }
            })
            const meExisted = oldUsers.find(({id}) => id === userState.id);
            
            if (!meExisted) {
                const meNew = users.findIndex(({id}) => id === userState.id)
                console.log('USErs data me', userState, meNew, ~meNew, userState.localStream)
                if (~meNew && userState.localStream) {
                    users[meNew].stream = userState.localStream;
                }
                
            } 
            // users.find()
            return {
                ...p,
                users: users
            }
        })
    }, [userState.id, userState.localStream])

    useEffect(() => {
        socket.on(ROOM_EVENTS.userJoin, userJoin);
        // socket.on(ROOM_EVENTS.userLeave, userLeave);
        socket.on(ROOM_EVENTS.usersData, usersData);
    }, [])



    const actions = {
        setStream
    }

    return <UsersContext.Provider
        value={{
            state,
            actions
        }}
    >
        {children}
    </UsersContext.Provider>
}

UsersContextProvider.defaultProps = {
    state: {
        users: []
    }
}

export { UsersContext, UsersContextProvider };