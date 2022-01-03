import { Server, Socket } from 'socket.io';
import { TEXT_CHAT_EVENTS } from './const/textChat/TEXT_CHAT_EVENTS';
import { ITextChatMessage } from './const/textChat/types';

class TextChat {
    private roomId: string;
    private io: Server;
    private sockets: Map<string, Socket>;

    constructor(roomId: string, io: Server) {
        this.roomId = roomId;
        this.io = io;
        this.sockets = new Map();
    }

    subscribe = (socket: Socket) => {
        socket.on(TEXT_CHAT_EVENTS.sendMessage, this.receiveMessage.bind(this, socket))
    }

    receiveMessage = (socket: Socket, data: ITextChatMessage) => {
        this.emitToToomButSocket(socket, TEXT_CHAT_EVENTS.sendMessage, data);
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

export default TextChat;