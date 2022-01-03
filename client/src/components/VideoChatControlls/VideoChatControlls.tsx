import React from "react"
import { Button, Icon } from "react-materialize";
import CamIcon from "../../icons/CamIcon/CamIcon";
import MicIcon from "../../icons/MicIcon/MicIcon";
import styles from './VideoChatControlls.module.scss'
import { useContext } from 'react';
import { VideoChatContext } from "../../context/videoChat.context";

const VideoChatControlls = () => {
    const { actions: { changeEnabledDevicesTypes }, state: {enabledDevicesTypes} } = useContext(VideoChatContext);

    return <div className={styles.videoChatControlls}>
        <div>
            <Button
                className={styles.controllButton}
                floating
                icon={<CamIcon active />}
                large
                node="button"
                waves="light"
                onClick={() => changeEnabledDevicesTypes({...enabledDevicesTypes, video: !enabledDevicesTypes.video })}
            />
        </div>
        <div>
            <Button
                className={styles.controllButton}
                floating
                icon={<MicIcon active />}
                large
                node="button"
                waves="light"
                onClick={() => changeEnabledDevicesTypes({...enabledDevicesTypes, audio: !enabledDevicesTypes.audio })}
            />

        </div>
    </div>
}

export default VideoChatControlls;