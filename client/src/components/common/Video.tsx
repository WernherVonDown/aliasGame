import classNames from 'classnames';
import React, { useEffect, useContext, MutableRefObject, useRef } from 'react'

interface IProps {
    stream: MediaStream | undefined;
    muted?: boolean;
    className?: string;
}

const Video = (props: IProps) => {
    const { stream, muted, className = '' } = props;
    const videoRef: MutableRefObject<any> = useRef()
    useEffect(() => {
        if (videoRef.current){
            console.log('VIDEO', stream?.active)
            videoRef.current.srcObject = stream;
        }
    }, [stream])

    return <video className={classNames(className)} ref={videoRef} muted={muted} autoPlay/>
}

export default Video;