import React, { useState, useEffect } from "react";
import { Button, Select } from "react-materialize";
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

const CreateGame = () => {
    const [foreignLang, setForeign] = useState(Langs.FR);
    const [motherLang, setMotherLang] = useState(Langs.RUS);
    const { socket } = useSockets();
    const history = useHistory();

    useEffect(() => {
        subscibe();
        return () => {

        }
    }, [])

    const unsubscribe = () => {

    }

    const subscibe = () => {
        socket.on(ROOM_EVENTS.checkRoom, checkRoom)
        socket.on(ROOM_EVENTS.createRoom, roomCreated)
    }

    const roomCreated = (data: any) => {
        console.log("EEEEEEEEE", data)
        if (data.success) {
            history.push(`/room/${data.roomId}`);
        }
    }

    const checkRoom = (data: ICheckRoomResult) => {
        const { roomId, result } = data;
        console.log('checkRoom', { roomId, result })
        if (!result) {
            const createRoomData: IRoomCreate = {
                roomId,
                langs: {
                    foreignLang,
                    motherLang
                }
            }
            socket.emit(ROOM_EVENTS.createRoom, createRoomData);
        } else {
            createGame();
        }
    }

    const createGame = () => {
        const roomId = shorid.generate();


        socket.emit(ROOM_EVENTS.checkRoom, roomId);
    }

    return <div className={styles.content}>
        <MainHeader/>
        <div className={styles.crateGameWrapper}>
            <div className={styles.crateGameDescription}>
                Игра Alias на иностранном языке помогает развивать разговорные навыки за счёт активной практики.
            </div>
            <div className={styles.createGame}>
                <div className={styles.createGameTitle}>
                    Выберите языковую пару:
                </div>
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
                                Французский
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
                                Русский
                            </option>
                        </Select>
                    </div>
                </div>
                <div>
                    <Button onClick={createGame}>Войти</Button>
                </div>
            </div>
        </div>
    </div>
}

export default CreateGame;