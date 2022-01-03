import React from "react"
import User from "./User"
import { useContext, useEffect } from 'react';
import { UsersContext } from "../../context/users.context";
import { IUser } from '../../const/user/types';
import { VideoChatContext } from "../../context/videoChat.context";
import { DEFAULT_CONSTRAINTS } from '../../const/videoChat/DEFAULT_CONSTRAINTS';
import { UserContext } from "../../context/user.context";

const Users = () => {
    const { state: { users }, actions: usersActions} = useContext(UsersContext)
    const {actions: videoChatActions} = useContext(VideoChatContext);
    const {state: userState} = useContext(UserContext)

    useEffect(() => {
        
        videoChatActions.getLocalStream(DEFAULT_CONSTRAINTS);
    }, [])

    useEffect(() => {

        if (userState.localStream) {
            usersActions?.setStream({userId: userState.id, stream: userState.localStream})
        }

    }, [userState.localStream])
    console.log('USERS CONTEXT', users)
    // const users: IUser[] = [
    //     { userName: 'Vadim', score: 12, maxScore: 36, fine: 2 },
    //     { userName: 'Petya', score: 12, maxScore: 36, fine: 2 },
    //     { userName: 'Vasya', score: 12, maxScore: 36, fine: 2 },
    // ]
    return <div className="users">
        {users.map(({ userName, score, maxScore, teamColor, id, stream }: IUser) => (
            <User key={`user_${id}`} id={id} stream={stream} userName={userName} score={score} maxScore={maxScore} teamColor={teamColor} />
        ))}
    </div>
}

export default Users;