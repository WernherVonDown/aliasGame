import React, { ReactElement, useState, useCallback, useEffect } from "react";
import { useSockets } from './socket.context';
import { useContext } from 'react';
import { UserContext } from "./user.context";
import { UsersContext } from "./users.context";
import PeerConnectionHelper from "../utils/helpers/peerConnectionHelper";
import { VIDEOCHAT_EVENTS } from '../const/videoChat/VIDEOCHAT_EVENTS';
import { ROOM_EVENTS } from '../const/room/ROOM_EVENTS';
import { IUser } from '../const/user/types';
import { DEFAULT_CONSTRAINTS } from '../const/videoChat/DEFAULT_CONSTRAINTS';
import Peer from 'simple-peer'

interface IState {
    localStream: MediaStream;
    devices: MediaDeviceInfo[];
    enabledDevicesTypes: {
        audio: boolean;
        video: boolean;
    }
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

const peers = {};

const VideoChatContext = React.createContext({} as ContextValue);

const peerConnectionsStore: any = {}

const VideoChatContextProvider = (props: IProps) => {
    const { children, state: defaultState } = props;
    const [state, setState] = useState<IState>(defaultState);
    const { socket } = useSockets();
    const { actions: usersActions, state: usersState } = useContext(UsersContext);
    const { state: userState, actions: userActions } = useContext(UserContext);
    let localStream: MediaStream | null = null;

    useEffect(() => {
        // console.log('==GET PEER', userState.id)
        // getPeerConnection(userState.id);
    }, [])

    useEffect(() => {
        console.log('==GOT STREAM', state.localStream)
        if (state.localStream) {
            // const pc = getPeerConnection(userState.id)
            // pc.addStream(state.localStream)
        }
    }, [state.localStream])

    const answerCall = async ({ source, sdp }: any) => {
        const pc = getPeerConnection(source);
        pc.setRemoteDescription(sdp)
        const stream = state.localStream || localStream || await getLocalStream(DEFAULT_CONSTRAINTS)
        pc.addStream(stream)
        // stream.getTracks().forEach(function (track) {
        //     pc.myPC.addTrack(track, stream);
        //   });
        console.log('GET LOCAL STREAM 2', state, localStream, usersState)
        const sdpAnswer = await pc.handleAnswer(sdp);

        const answerData = {
            target: source,
            source: socket.id,
            type: "video-answer",
            sdp: sdpAnswer
        }
        sendToServer(answerData);
    }

    const handleVideoAnswerMsg = async (data: any) => {
        const { source, sdp } = data;
        const pc = getPeerConnection(source);
        await pc.setRemoteDescription(sdp);
    }

    const handleNewICECandidateMsg = async (data: any) => {
        const { source, candidate } = data;
        const pc = getPeerConnection(source);
        await pc.handleNewICECandidate(candidate);

    }

    const userJoin = (data: IUser) => {
        console.log('START CALL', data, data.id)
        startCall(data.id);
    }

    // useEffect(() => {
    //     userState.deviceSet()

    // }, [userState.deviceSet])

    useEffect(() => {
        socket.on(ROOM_EVENTS.userJoin, userJoin);
        socket.on(VIDEOCHAT_EVENTS.sendToServer, (msg) => {
            console.log('VIDEO_CHAT', msg)
            switch (msg.type) {
                case "video-offer":  // Invitation and offer to chat
                    answerCall(msg);
                    break;

                case "video-answer":  // Callee has answered our offer
                    handleVideoAnswerMsg(msg);
                    break;

                case "new-ice-candidate": // A new ICE candidate has been received
                    handleNewICECandidateMsg(msg);
                    break;

                // case "hang-up": // The other peer has hung up the call
                //     handleHangUpMsg(msg);
                //     break;
            }
        })
    }, [])

    const sendToServer = (data: any) => {
        console.log('sendToServer', data)
        socket.emit(VIDEOCHAT_EVENTS.sendToServer, data);
    }

    const handleICECandidateEvent = (socketId: string, e: any) => {
        if (e.candidate) {
            sendToServer({
                type: "new-ice-candidate",
                source: socket.id,
                target: socketId,
                candidate: e.candidate
            });
        }
    }

    const handleTrackEvent = (socktId: string, e: any) => {
        console.log('EEEE handleTrackEvent', e.streams)
        if (!e.streams) return;
        usersActions.setStream({ userId: socktId, stream: e.streams[0] })
        // if (!remoteStreamsStore[socktId]) {
        //     remoteStreamsStore[socktId] = e.streams[0];
        //     forceUpdate()
        // }
    }

    const getPeerConnection = (socketId: string) => {
        if (peerConnectionsStore[socketId]) return peerConnectionsStore[socketId];
        peerConnectionsStore[socketId] = new PeerConnectionHelper();
        peerConnectionsStore[socketId].setIceCandidateHandler(handleICECandidateEvent.bind(this, socketId));
        peerConnectionsStore[socketId].setOnTrackHandler(handleTrackEvent.bind(this, socketId));
        // if (state.localStream || localStream) {
        //     peerConnectionsStore[socketId].addStream(state.localStream || localStream)
        // }
        return peerConnectionsStore[socketId];
    }

    const startCall = async (socketId: string) => {
        console.log('startCall')
        const pc = getPeerConnection(socketId);
        const stream = state.localStream || localStream || await getLocalStream(DEFAULT_CONSTRAINTS)
        console.log('GET LOCAL STREAM 1', state, localStream, usersState, userState.id)
         pc.addStream(stream)

        // stream.getTracks().forEach(function (track) {
        //     pc.myPC.addTrack(track, stream);
        //   });

        const sdp = await pc.createOffer();

        const callData = {
            source: socket.id,
            target: socketId,
            type: "video-offer",
            sdp
        }
        sendToServer(callData)
    }

    const getListOfDevices = async () => {
        const devices = await navigator.mediaDevices.enumerateDevices();

        console.log('getListOfDevices', devices)

        setState((p: IState) => {
            return {
                ...p,
                devices,
            }
        })
    }

    const changeVideoConstraints = async (stream: MediaStream, enabled: boolean) => {
        if (stream) {
            //if (videoConstraints) {
            const videoTracks = await stream.getVideoTracks();
            videoTracks.forEach(track => track.enabled = enabled);
            // await videoTrack.applyConstraints(videoConstraints);

            //}
        }
    }

    const changeAudioConstraints = async (stream: MediaStream, enabled: boolean) => {
        if (stream) {
            const audioTracks = await stream.getAudioTracks();
            audioTracks.forEach(track => track.enabled = enabled)
            //await audioTracks.applyConstraints(audioConstraints);
        }
    }

    const changeEnabledDevicesTypes = ({ video, audio }: { video: boolean, audio: boolean }) => {
        setState((p: IState) => {
            if (p.enabledDevicesTypes.video !== video) {
                changeVideoConstraints(p.localStream, video)
            }

            if (p.enabledDevicesTypes.audio !== audio) {
                changeAudioConstraints(p.localStream, audio);
            }

            return {
                ...p,
                enabledDevicesTypes: { video, audio }
            }
        })
    }

    const getLocalStream = async ({ audio, video }: MediaStreamConstraints) => {
        try {
            if (state.localStream || localStream) return state.localStream || localStream
            const stream = await navigator.mediaDevices.getUserMedia({ audio, video });
            console.log('getLocalStream', stream)
            if (stream) {
                // const result = usersActions.setStream({ userId: userState.id, stream });
                // if (!result) 
                userActions.setLocalStream(stream)
                localStream = stream;
                setState((p: IState) => {
                    return {
                        ...p,
                        localStream: stream,
                        enabledDevicesTypes: {
                            audio: !!audio,
                            video: !!video,
                        }
                    }
                })

                return stream;
            } else {
                alert('Не удалось получить стрим')
            }

        } catch (error) {
            console.log('Error getLocalStream', error)
        }

    }



    const actions = {
        getLocalStream,
        startCall,
        getListOfDevices,
        changeEnabledDevicesTypes,
    }

    return <VideoChatContext.Provider
        value={{
            state,
            actions
        }}
    >
        {children}
    </VideoChatContext.Provider>
}

VideoChatContextProvider.defaultProps = {
    state: {
        localStream: null,
        devices: [],
        enabledDevicesTypes: {
            audio: true,
            video: true,
        }
    },
}

export { VideoChatContext, VideoChatContextProvider };