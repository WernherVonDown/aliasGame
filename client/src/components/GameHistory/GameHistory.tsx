import React from "react"
import { Button } from "react-materialize";
import styles from './GameHistory.module.scss';
import { WordStatuses } from '../../const/word/WORD_STATUSES';
import { IGameHistory } from '../../const/gameHistory/types';
import GameHistoryItem from "./GameHistoryItem";
import VideoChatControlls from "../VideoChatControlls/VideoChatControlls";
import { GameContext } from "../../context/game.context";
import { useContext } from 'react';
import { ITeamScore } from '../../const/game/types';
import { UsersContext } from "../../context/users.context";

const GameHistory = () => {
    const { state: gameState } = useContext(GameContext);
    const { state: usersState } = useContext(UsersContext);
    return <div className={styles.gameHistory}>
        {gameState.teamsScores.sort((a, b) => b.score - a.score).map(({ teamColor, score }: ITeamScore, i: number) => {
            const users = usersState.users.filter(u => u.teamColor === teamColor);
            return <div key={`teamScore_${teamColor}_${score}`} style={{ background: teamColor }} className={styles.gameHistoryItem}>
                <div className={styles.order}>
                    {i+1}
                </div>
                <div className={styles.usersWrapper}>
                    {users.map(u => (
                        <div key={`history_user_${u.id}`}className={styles.user}>{u.userName}</div>
                    ))}
                </div>
                <div className={styles.score}>{score}</div>
            </div>
        })}
        {/* {gameHistory.map(({user, words}: IGameHistory, i: number) => {
            return <GameHistoryItem key={i + user.name} words={words} user={user}/>
        })} */}
        <VideoChatControlls />
    </div>
}

export default GameHistory;