import React, { useEffect, useState } from 'react'
import { ProgressBar } from 'react-materialize';
import { useSockets } from '../../context/socket.context';
import { GAME_EVENTS } from '../../const/game/GAME_EVENTS';

const MAX_TIMER = 60 * 1000;

const ProgressBarTimer = () => {
    const [progress, setProgress] = useState(0)
    const { socket } = useSockets()

    useEffect(() => {
        const onePercent = MAX_TIMER / 100;
        socket.on(GAME_EVENTS.gameTimer, (timer: number) => {
            setProgress(timer / onePercent)
        })
    }, [])
    return <ProgressBar progress={progress} />
}

export default ProgressBarTimer;