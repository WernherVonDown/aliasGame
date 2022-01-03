import React from "react"
import { Button, ProgressBar } from "react-materialize";
import GameHistory from "../GameHistory/GameHistory";
import styles from './Game.module.scss'
import Words from "./Words";
import { useContext, useEffect } from 'react';
import { GameContext } from "../../context/game.context";
import { UserContext } from "../../context/user.context";
import { WordStatuses } from '../../const/word/WORD_STATUSES';
import { VideoChatContext } from "../../context/videoChat.context";
import { UsersContext } from "../../context/users.context";
import Video from "../common/Video";


const Game = () => {
    const { state: { gameStarted, roundStarted, showWordStatus,currentTeam }, actions: gameActions } = useContext(GameContext);
    const { state: userState, actions: userActions } = useContext(UserContext);
    const { state: usersState } = useContext(UsersContext);
    const ready = true;


    const renderWordPanel = () => {
        if (userState.active) {
            if (!gameStarted) {
                return (
                    <div className={styles.readyWrapper}>
                        <Button onClick={gameActions.startGame}>Начать игру?</Button>
                    </div>
                )
            }
            if (!roundStarted) {
                return (
                    <div className={styles.readyWrapper}>
                        <Button onClick={gameActions.startRound}>Готовы?</Button>
                    </div>
                )
            }

            return <Words />
        } else {
            if (!gameStarted) {
                return (
                    <div className={styles.readyWrapper}>
                        Ждём пока пользователь начнет игу...
                    </div>
                )
            }
            if (!ready) {
                return (
                    <div className={styles.readyWrapper}>
                        Ждём пока пользователь будет готов...
                    </div>
                )
            }

            const activeUsers = usersState.users.filter(u=> u.teamColor === currentTeam)
            console.log('ACTIVE USERS', currentTeam, usersState.users)
            return <div className={styles.gameVideosWrapper}>
                {/* <div>Игра началась!</div> */}
                {/* <div> */}
                    {
                        activeUsers.map(u => <Video key={`gameVideo_${u.id}`} className={styles.gameActiveUserVideo} stream={u.stream}/>)
                    }
                {/* </div> */}

            </div>
        }
    }

    const renderWordStatus = () => {
        console.log('renderWordStatus', showWordStatus)
        if (!showWordStatus) return null;
        const { word: { foreignLang, motherLang }, status } = showWordStatus;

        console.log('RENDER STATUS', showWordStatus)
        return (
            <div className={styles.wordStatusWrapper}>
                <div className={styles.wordStatus}>
                    {`${foreignLang} - ${motherLang}`}
                </div>
            </div>
        )
    }

    return <div className={styles.game}>
        <div className={styles.wordWrapper}>
            {renderWordPanel()}
            {renderWordStatus()}
        </div>
    </div>
}

export default Game;