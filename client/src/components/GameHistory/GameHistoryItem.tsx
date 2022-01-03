import React from "react"
import { Button } from "react-materialize";
import styles from './GameHistory.module.scss'
import { IGameHistory } from '../../const/gameHistory/types';
import { IWord } from '../../const/word/types';
import Word from "./Word";

type IProps = IGameHistory;

const GameHistoryItem = (props: IProps) => {
    const { user: { name }, words } = props;

    return <div className={styles.gameHistoryItem}>
            <div>
                {name}
            </div>
        <div className={styles.wordItem}>
            {words.map(({ score, id, text, status }: any) => {
                return <Word key={id} id={id} score={score} text={text} status={status} />
            })}
        </div>
    </div>
}

export default GameHistoryItem;