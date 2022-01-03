import React, { MutableRefObject, useRef } from "react"
import {useEffect, useState} from 'react';
import Video from "../common/Video";

interface IProps {
    userName: string,
    maxScore: number,
    score: number,
    teamColor: string,
    id: string,
    stream?: MediaStream
}


const User = (props: IProps) => {
    const {userName, maxScore, score, teamColor, id, stream} = props;
    // const [stream, setStream] = useState()
    // const videoRef: MutableRefObject<any> = useRef()
    // useEffect(() => {
    //     // if (videoRef.current)
    //     //     videoRef.current.srcObject = stream;
    // }, [stream])
    
    return <div className="user" style={{border: `solid 2px ${teamColor}`}}>
        <div className="user--name">{userName}</div>
        {<Video stream={stream}/>}
        {/* <div className="user--params">
            <div className="user--params--score">Счет{score}/{maxScore}</div>
        </div> */}
    </div>
}

export default User;