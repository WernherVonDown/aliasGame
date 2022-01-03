import React from "react"
import { Button } from "react-materialize";
import styles from './GameHistory.module.scss'
import { IGameHistory } from '../../const/gameHistory/types';
import { IWord } from "../../const/word/types";
import classNames from 'classnames';

type IProps = any;

const Word = (props: IProps) => {
    const { score, id, text, status } = props;

    return <div className={classNames(styles.wordWrapper, styles[status])}>
        <div>
            {text}
        </div>
        <div className={styles.scoreWrapper}>
            <div>
                счёт:
            </div>
            <div>
            {score}
            </div>
        </div>
    </div>
}

export default Word;