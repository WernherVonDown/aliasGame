import React, { useEffect, useContext } from 'react'
import { VideoChatContext } from '../../context/videoChat.context';
import { DEFAULT_CONSTRAINTS } from '../../const/videoChat/DEFAULT_CONSTRAINTS';
import Video from '../common/Video';
import { UserContext } from '../../context/user.context';
import { Button, Select } from 'react-materialize';
import styles from './PrepareMediaDevices.module.scss'

interface IProps {
    onDeviceSet?: () => void;
}

const PrepareMediaDevices = (props: IProps) => {
    const { actions: videoChatActions, state: videoChatState } = useContext(VideoChatContext);
    const { actions: userActions } = useContext(UserContext);
    const { onDeviceSet } = props;

    useEffect(() => {

        videoChatActions.getLocalStream(DEFAULT_CONSTRAINTS);
        // videoChatActions.getListOfDevices();

    }, [])

    return <div className={styles.prepareMediaDevices}>
        <div className={styles.prepareDevicesHeader}>
            Prepare Devices
        </div>
        <div className={styles.prepareDevicesBody}>
            <div className={styles.prepareDevicesVideo}><Video stream={videoChatState.localStream} /></div>
            <div className={styles.prepareDevicesButton}><Button onClick={() => {
                userActions.devicesSet();
                if (onDeviceSet) {
                    onDeviceSet()
                }
                }}>Готово</Button></div>
        </div>

    </div>
}

export default PrepareMediaDevices;