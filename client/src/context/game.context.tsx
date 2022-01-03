import React, { ReactElement, useState, useCallback, useEffect } from "react";
import { IMessage } from '../const/textChat/types';
import { TEXT_CHAT_EVENTS } from '../const/textChat/TEXT_CHAT_EVENTS';
import { useSockets } from './socket.context';
import { useContext } from 'react';
import { UserContext } from "./user.context";
import { GAME_EVENTS } from '../const/game/GAME_EVENTS';
import { IWord, IWordData } from '../const/word/types';
import { WordStatuses } from '../const/word/WORD_STATUSES';
import { ITeamScore } from '../const/game/types';

interface IState {
    currentWord: IWord;
    currentTeam: string;
    currentUserId: string;
    isReady: boolean;
    gameStarted: boolean;
    words: IWord[];
    roundStarted: boolean;
    showWordStatus: { word: IWord, status: WordStatuses } | null;
    teamsScores: ITeamScore[]
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

const GameContext = React.createContext({} as ContextValue);

const GameContextProvider = (props: IProps) => {
    const { children, state: defaultState } = props;
    const [state, setState] = useState<IState>(defaultState);
    const { socket } = useSockets();
    const { state: userState, actions: userActions } = useContext(UserContext);

    const startGame = () => {
        socket.emit(GAME_EVENTS.startGame);
    }

    const getWord = useCallback(() => {
        socket.emit(GAME_EVENTS.getWord)
    }, [])


    const startRound = () => {
        socket.emit(GAME_EVENTS.roundStarted);
    }

    const sendWordStatus = (word: IWord, status: WordStatuses) => {
        socket.emit(GAME_EVENTS.wordStatus, { word, status });
    }

    const onStartGame = useCallback(() => {
        setState((p: IState) => {
            return {
                ...p,
                gameStarted: true
            }
        })
    }, [])

    const onChangeState = useCallback((data: { currentUserId: string, currentTeam: string }) => {
        console.log('onChangeState', data)
        userActions.setUser({
            active: userState.id === data.currentUserId
        })

        //setContext({currentUserId: data.currentUserId})
        setState((p: IState): IState => {
            return {
                ...p,
                currentUserId: data.currentUserId,
                currentTeam: data.currentTeam
            }
        })
    }, [])

    const onRoundStarted = useCallback((data: boolean) => {
        console.log('onRoundStarted', data)
        setState((p: IState) => {
            return {
                ...p,
                roundStarted: data
            }
        })
    }, []);

    const clearWord = () => {
        setState((p: IState) => {
            return {
                ...p,
                words: p.words.slice(1)
            }
        })
    }

    const initWord = (word: IWordData): IWord => ({
        ...word,
        status: WordStatuses.UNKNOWN,
        score: 0,
        id: `word_${word.foreignLang}_${word.motherLang}`
    })

    const onGetWord = useCallback((data: IWordData) => {
        console.log('onGetWord', data)
        const word = initWord(data)
        setState((p: IState) => {
            return {
                ...p,
                words: [word, ...p.words.slice(0, -1)]
            }
        })
    }, []);

    const onGetWords = useCallback((data: IWordData[]) => {
        console.log('onGetWords', data)
        const words = data.map(initWord)
        setState((p: IState) => {
            return {
                ...p,
                words
            }
        })
    }, [])

    const hideWordStatus = useCallback(() => {
        console.log("hideWordStatus")
        setState((p: IState) => {
            return {
                ...p,
                showWordStatus: null
            }
        });
    }, []);


    const onGetWordStatus = useCallback((data: { word: IWord, status: WordStatuses }) => {
        console.log('onGetWordStatus', data, state, userState)
        if (state.currentUserId === userState.id) {
            console.log("SHOULD HIDE")
            // if (state.showWordStatus) return hideWordStatus()
            return;
        }
        setState((p: IState) => {
            console.log("SET STATE showWordStatus", data)
            return {
                ...p,
                showWordStatus: data
            }
        });
        setTimeout(hideWordStatus, 3000);
    }, []);

    const onTeamsScores = useCallback((data: ITeamScore[]) => {
        setState((p: IState) => {
            return {
                ...p,
                teamsScores: data
            }
        });
    }, []);


    useEffect(() => {
        socket.on(GAME_EVENTS.startGame, onStartGame);
        socket.on(GAME_EVENTS.changeState, onChangeState);
        socket.on(GAME_EVENTS.roundStarted, onRoundStarted);
        socket.on(GAME_EVENTS.getWords, onGetWords);
        socket.on(GAME_EVENTS.getWord, onGetWord);
        socket.on(GAME_EVENTS.wordStatus, onGetWordStatus);
        socket.on(GAME_EVENTS.teamsScores, onTeamsScores)
    }, [])



    const actions = {
        startGame,
        startRound,
        getWord,
        clearWord,
        sendWordStatus,
    }

    return <GameContext.Provider
        value={{
            state: {...state},
            actions
        }}
    >
        {children}
    </GameContext.Provider>
}

GameContextProvider.defaultProps = {
    state: {
        messages: [],
        showWordStatus: null,
        currentUserId: '',
        teamsScores: []
    },
}

export { GameContext, GameContextProvider };