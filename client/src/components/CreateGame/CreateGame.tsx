import React, { useState, useEffect, useContext, useMemo, useRef } from "react";
import { Button, Checkbox, Select } from "react-materialize";
import SwapHorizIcon from '../../icons/SwapHorizIcon/SwapHorizIcon';
import styles from './CreateGame.module.scss'
import { Langs } from '../../const/languages/LANGS';
import RusFlag from '../../icons/Flags/RusFlag';
import shorid from 'shortid';
import { IRoomCreate, ICheckRoomResult } from '../../const/room/types';
import { useSockets } from '../../context/socket.context';
import { ROOM_EVENTS } from '../../const/room/ROOM_EVENTS';
import { useHistory } from "react-router-dom";
import Header from "../Header/Header";
import MainHeader from "../MainHeader/MainHeader";
import { UserContext } from "../../context/user.context";
import { AuthContext } from "../../context/auth.context";

const CreateGame = () => {
    const { state: userState, actions: userActions } = useContext(UserContext)
    const { state: authState } = useContext(AuthContext)
    const [foreignLang, setForeign] = useState(Langs.FR);
    const [motherLang, setMotherLang] = useState(Langs.RUS);
    const [useCustomWords, setUseCustomWords] = useState(false);
    console.log('USE')
    const [customWords, setCustomWords] = useState('')
    const cWRef = useRef('')

    const { socket } = useSockets();
    const history = useHistory();

    useEffect(() => {
        subscibe();
        console.log('MOUNT')
        return () => {
            console.log('UNMOUNT')
        }
    }, [])

    useEffect(() => {
        if (authState.loggedIn) {
            userActions.getCustomWords()
        }
    }, [authState.loggedIn])

    const unsubscribe = () => {

    }

    const subscibe = () => {
        socket.on(ROOM_EVENTS.checkRoom, checkRoom.bind(this))
        socket.on(ROOM_EVENTS.createRoom, roomCreated)
    }

    const roomCreated = (data: any) => {
        console.log("EEEEEEEEE", data)
        if (data.success) {
            history.push(`/room/${data.roomId}`);
        }
    }

    useEffect(() => {
        if (useCustomWords && !customWords.length && userState.customWords.length) {
            console.log('SET CUSOM WORDS', userState.customWords[0]._id)
            setCustomWords(userState.customWords[0]._id)
        }
    }, [userState.customWords, customWords, useCustomWords])

    const checkRoom = (data: ICheckRoomResult) => {
        const { roomId, result } = data;
        console.log('checkRoom', { roomId, result, customWords }, cWRef.current)
        if (!result) {

            const createRoomData: IRoomCreate = {
                roomId,
                langs: {
                    foreignLang,
                    motherLang
                },
                custom: customWords || cWRef.current
            }
            socket.emit(ROOM_EVENTS.createRoom, createRoomData);
        } else {
            createGame();
        }
    }

    const createGame = () => {
        const roomId = shorid.generate();
        cWRef.current = customWords;
        console.log('CREATE R', cWRef.current)
        socket.emit(ROOM_EVENTS.checkRoom, roomId);
    }

    const onUseCustomChanged = (e: any) => {
        setUseCustomWords(!useCustomWords)
    }

    const getCustomWords = () => {
        if (!authState.loggedIn) {
            return (
                <div>
                    ??????????????, ?????? ?????????? ???????????????? ?????????????????? ???????? ????????????
                    <Button onClick={() => history.push('/login')}>
                        ??????????
                    </Button>
                </div>
            )
        } else {
            if (userState.customWords.length){
                console.log('EEE CREATE', userState.customWords)
                return <div>
                    <Select
                        id="Select-32"
                        multiple={false}
                        onChange={
                            (e) => {
                                console.log('EEE SET', e.target.value); 
                                setCustomWords(e.target.value);
                                console.log("AFTER", customWords)
                            }
                            }
                        options={{
                            classes: '',
                            dropdownOptions: {
                                alignment: 'left',
                                autoTrigger: true,
                                closeOnClick: true,
                                constrainWidth: true,
                                coverTrigger: true,
                                hover: false,
                                inDuration: 150,
                                outDuration: 250
                            }
                        }}
                        value={userState.customWords[0]._id}
                    >
                        {userState.customWords.map(w => {
                            console.log('RENDER W', w)
                            return <option key={w._id} value={w._id}>
                                {w.name}
                            </option>
                        })}

                    </Select>
                    <Button onClick={() => history.push('/words/add')}>????????????????</Button>
                </div>
                } else {
                    return <div>?? ?????? ???????? ?????? ????????<Button onClick={() => history.push('/words/add')}>????????????????</Button></div>
                }
        }
    }

    const getWords = () => {
        if (!useCustomWords) {
            return (
                <div className={styles.selectLangPairWrapper}>
                    <div>
                        <Select
                            id="Select-31"
                            multiple={false}
                            onChange={function noRefCheck() { }}
                            options={{
                                classes: '',
                                dropdownOptions: {
                                    alignment: 'left',
                                    autoTrigger: true,
                                    closeOnClick: true,
                                    constrainWidth: true,
                                    coverTrigger: true,
                                    hover: false,
                                    inDuration: 150,
                                    outDuration: 250
                                }
                            }}
                            value={foreignLang}
                        >
                            <option value={Langs.FR}>
                                ??????????????????????
                            </option>
                        </Select>
                    </div>
                    <div><SwapHorizIcon /></div>
                    <div>
                        <Select
                            id="Select-31"
                            multiple={false}
                            onChange={function noRefCheck() { }}
                            options={{
                                classes: '',
                                dropdownOptions: {
                                    alignment: 'left',
                                    autoTrigger: true,
                                    closeOnClick: true,
                                    constrainWidth: true,
                                    coverTrigger: true,
                                    hover: false,
                                    inDuration: 150,
                                    outDuration: 250
                                }
                            }}
                            value={motherLang}
                        >
                            <option value={Langs.RUS}>
                                ??????????????
                            </option>
                        </Select>
                    </div>
                </div>
            )
        }

        return getCustomWords()

    }

    return <div className={styles.content}>
        <MainHeader />
        <div className={styles.crateGameWrapper}>
            <div className={styles.crateGameDescription}>
                ???????? Alias ???? ?????????????????????? ?????????? ???????????????? ?????????????????? ?????????????????????? ???????????? ???? ???????? ???????????????? ????????????????.
            </div>

            <div className={styles.createGame}>
                <div className={styles.createGameTitle}>
                    ???????????????? ???????????????? ????????:
                </div>
                {getWords()}
                <div>
                    <Checkbox
                        id="Checkbox_1"
                        label="???????????????????????? ????????"
                        value="custom"
                        onChange={onUseCustomChanged}
                    />
                </div>
                <div>
                    <Button onClick={createGame}>??????????</Button>
                </div>
            </div>
        </div>
    </div>
}

export default CreateGame;