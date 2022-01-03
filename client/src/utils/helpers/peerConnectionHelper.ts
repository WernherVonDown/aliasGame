const iceServers: RTCIceServer[] = [
    {
        urls: 'stun:stun.l.google.com:19302'
    },
    {
        urls: ['turn:78.46.107.230:3486'],
        username: 'kurentoturn',
        credential: 'kurentoturnpassword'
    },
]

export default class PeerConnectionHelper {
    private myPC: RTCPeerConnection;
    private iceCandidatesQueue: RTCIceCandidate[];
    private remoteDescription: RTCSessionDescription | null;
    private localStream: MediaStream | null;

    constructor() {
        this.myPC = new RTCPeerConnection({
            iceServers
        });

        this.iceCandidatesQueue = [];
        this.remoteDescription = null;
        this.localStream = null;

        this.subscribe();
        
    }

    subscribe = () => {
       // this.myPC.onicecandidate = this.handleICECandidateEvent;//this
        //this.myPC.onnegotiationneeded = this.handleNegotiationNeededEvent;
        // this.myPC.onremovetrack = this.handleRemoveTrackEvent;
        this.myPC.oniceconnectionstatechange = this.handleICEConnectionStateChangeEvent;
        this.myPC.onicegatheringstatechange = this.handleICEGatheringStateChangeEvent;
        this.myPC.onsignalingstatechange = this.handleSignalingStateChangeEvent;
        //this.myPC.ontrack = this.handleTrackEvent; //track
    }

    setIceCandidateHandler = (handler: any) => {
        this.myPC.onicecandidate = handler;
    }

    setOnTrackHandler = (handler: any) => {
        this.myPC.ontrack = handler;
    }

    setHandleNegotiationNeededEvent = (handler: any) => {
        // const offer = await this.myPC.createOffer();

    // If the connection hasn't yet achieved the "stable" state,
    // return to the caller. Another negotiationneeded event
    // will be fired when the state stabilizes.
    this.myPC.onnegotiationneeded = handler;
return ;
    if (this.myPC.signalingState != "stable") {
      console.log("     -- The connection isn't stable yet; postponing...")
      return false
    }

    // Establish the offer as the local peer's current
    // description.

    console.log("---> Setting local description to the offer");
    return this.createOffer()
    //await this.myPC.setLocalDescription(offer);
    }

    addStream = (stream: MediaStream) => {
        console.log('ADDDDD STREAM', stream)
        this.localStream = stream
        stream.getTracks().forEach(track => this.myPC.addTrack(track, stream));
    }

    createOffer = async () => {
        const offer = await this.myPC.createOffer();
        await this.myPC.setLocalDescription(offer);
        return this.myPC.localDescription;
    }

    setRemoteDescription = async (sdp: RTCSessionDescription) => {
        this.remoteDescription = new RTCSessionDescription(sdp);
        await this.myPC.setRemoteDescription(this.remoteDescription);
        await this.setCandidatesFromQueue()
    }

    setCandidatesFromQueue = async () => {
        await Promise.all(this.iceCandidatesQueue.map(this.handleNewICECandidate))
    }

    handleAnswer = async (sdp: RTCSessionDescription) => {
        //const desc = new RTCSessionDescription(sdp);
        // if (this.myPC.signalingState != "stable") {
        //     //log("  - But the signaling state isn't stable, so triggering rollback");
        
        //     // Set the local and remove descriptions for rollback; don't proceed
        //     // until both return.
        //     await Promise.all([
        //       this.myPC.setLocalDescription({type: "rollback"}),
        //       this.setRemoteDescription(sdp)
        //     ]);
        //     return this.myPC.localDescription;
        //   } 
       // await this.setRemoteDescription(sdp);
        await this.myPC.setLocalDescription(await this.myPC.createAnswer());
        console.log('HAHAH', this.iceCandidatesQueue)
        
        // if (!this.stream) {
        //     this.stream = await navigator.mediaDevices.getUserMedia({video: true, audio: true})
        // }
        // this.stream.getTracks().forEach(track => this.myPC.addTrack(track, this.stream));
        return this.myPC.localDescription;
    }

    handleNewICECandidate = async (candidate: RTCIceCandidate) => {
        const iceCandidate = new RTCIceCandidate(candidate);
        if (!this.remoteDescription) {this.iceCandidatesQueue.push(iceCandidate); return}
        console.log("*** Adding received ICE candidate: " + JSON.stringify(iceCandidate), 'aaa', candidate);
        await this.myPC.addIceCandidate(iceCandidate);
    }

    handleICECandidateEvent = (e: any) => {
        console.log("*** Outgoing ICE candidate: " + e.candidate.candidate);
        // if (e.candidate) {
        //     console.log("*** Outgoing ICE candidate: " + e.candidate.candidate);

        // //     sendToServer({
        // //         type: "new-ice-candidate",
        // //         target: targetUsername,
        // //         candidate: e.candidate
        // //     });
        //  }
        //console.log('handleICECandidateEvent', e);
    }

    handleTrackEvent = (e: any) => {
        console.log('handleTrackEvent', e);
    }

    handleNegotiationNeededEvent = (e: any) => {
        console.log('handleNegotiationNeededEvent', e);
    }

    handleRemoveTrackEvent = (e: any) => {
        console.log('handleRemoveTrackEvent', e);
    }

    handleICEConnectionStateChangeEvent = (e: any) => {
        console.log('handleICEConnectionStateChangeEvent', e);
    }

    handleICEGatheringStateChangeEvent = (e: any) => {
        console.log('handleICEGatheringStateChangeEvent', e);
    }

    handleSignalingStateChangeEvent = (e: any) => {
        console.log('handleSignalingStateChangeEvent', this.myPC && this.myPC.signalingState);
    }

}