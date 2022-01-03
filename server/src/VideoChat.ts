import { Server, Socket } from 'socket.io';
import { VIDEOCHAT_EVENTS } from './const/videoChat/VIDEOCHAT_EVENTS';

class VideoChat {
    private roomId: string;
    private io: Server;
    private sockets: Map<string, Socket>;

    constructor(roomId: string, io: Server) {
        this.roomId = roomId;
        this.io = io;
        this.sockets = new Map();
    }

    subscribe = (socket: Socket) => {
        socket.on(VIDEOCHAT_EVENTS.sendToServer, this.receiveMessage);
    }

    receiveMessage = (data: any) => {
        // this.emitToToomButSocket(socket, TEXT_CHAT_EVENTS.sendMessage, data);
        this.sendToUser(data.target, VIDEOCHAT_EVENTS.sendToServer, data)
    }

    sendToUser = (socketId: string, event: string, data: any)=> {
        this.io.to(socketId).emit(event, data);
    } 

    add(socket: Socket) {
        // this.sockets.add(socket.id, socket)
        this.subscribe(socket);
    }

    emitToToomButSocket(socket: Socket, event: string, data: any) {
        socket.to(this.roomId).emit(event, data);
    }

    emitToRoom(event: string, data: any): void {
        this.io.to(this.roomId).emit(event, data);
    }
}

export default VideoChat;