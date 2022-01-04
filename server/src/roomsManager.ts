import { Server, Socket } from 'socket.io';
import { COMMON_EVENTS } from './const/events';
import Room from './Room';
import { IRoomCreate } from './const/room/types';
import { ROOM_EVENTS } from './const/room/ROOM_EVENTS';
import log from './utils/logger';
import socket from './socket';

class RoomsManager {
    private io: Server;
    private rooms: Map<string, Room>;
    private users: Map<string, string>

    constructor(io: Server) {
        this.io = io;
        this.subscribe();
        this.rooms = new Map();
        this.users = new Map();
    }

    subscribe(): void {
        this.io.on(COMMON_EVENTS.connection, (socket: Socket): void => {
            socket.on(ROOM_EVENTS.createRoom, this.createRoom.bind(this, socket));
            socket.on(ROOM_EVENTS.joinRoom, this.joinRoom.bind(this, socket));
            socket.on(COMMON_EVENTS.disconnect, this.onDisconnect.bind(this, socket));
            socket.on(ROOM_EVENTS.checkRoom, this.checkRoomExists.bind(this, socket))
        })
    }

    checkRoomExists = (socket: Socket, roomId: string) => {
        log.info('checkRoomExists', roomId)
        socket.emit(ROOM_EVENTS.checkRoom, {
            result: this.rooms.has(roomId),
            roomId
        })
    }

    onDisconnect = (socket: Socket) => {
        const roomId = this.users.get(socket.id);
        if (roomId) {
            // this.rooms.get(roomId)?.leave(socket);
            this.users.delete(roomId)
        }
    }

    createRoom = (socket: Socket, {roomId, langs: {foreignLang, motherLang}, custom}: IRoomCreate) => {
        console.log('createRoom', {roomId, langs: {foreignLang, motherLang}, custom})
        this.rooms.set(roomId, new Room({roomId, langs: {foreignLang, motherLang}, custom}, this.io));
        socket.emit(ROOM_EVENTS.createRoom, {success: true, roomId})
    }

    joinRoom(socket: Socket, {roomId, userName}: {roomId: string, userName: string}) {
        // console.log('joinRoom', {roomId, userName}, this.rooms.get(roomId))
        this.rooms.get(roomId)?.join(socket, userName);
        this.users.set(socket.id, roomId);
    }
}

export default RoomsManager;