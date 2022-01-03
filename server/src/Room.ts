import { Socket, Server } from 'socket.io';
import User from './User';
import { COMMON_EVENTS } from './const/events';
import { ROOM_EVENTS } from './const/room/ROOM_EVENTS';
import { IRoomCreate } from './const/room/types';
import TextChat from './TextChat';
import Game from './Game';
import { USER_EVENTS } from './const/user/USER_EVENTS';
import VideoChat from './VideoChat';

class Room {
    public roomId: string;
    private io: Server;
    protected users: Map<string, User>;
    private textChat: TextChat;
    private game: Game;
    private videoChat: VideoChat

    constructor({ roomId, langs }: IRoomCreate, io: Server) {
        this.roomId = roomId;
        this.io = io;
        this.users = new Map();
        this.textChat = new TextChat(roomId, io);
        this.videoChat = new VideoChat(roomId, io);
        this.game = new Game({ roomId, langs }, io)
    }

    subscribe(socket: Socket): void {
        socket.on(COMMON_EVENTS.disconnect, this.leave.bind(this, socket));
    }

    join = (socket: Socket, userName: string) => {
        socket.join(this.roomId);
        this.subscribe(socket);
        const teamColor = this.game.addUserToTeam(socket.id); 
        console.log('join', userName, teamColor)
        const newUser = new User(userName, teamColor, socket.id, socket);
        this.users.set(socket.id, newUser);
        const user = { userName, roomId: this.roomId, id: socket.id, teamColor };
        socket.emit(ROOM_EVENTS.joinRoom, user);
        this.emitToToomButSocket(socket, ROOM_EVENTS.userJoin, user);
        this.sendUsersList()
        this.textChat.add(socket);
        this.videoChat.add(socket);
        this.game.add(socket, newUser);
        // socket.emit(ROOM_EVENTS.joinRoom, user)

    }

    sendUsersList = () => {
        const users = this.getUsersDto();
        this.emitToRoom(ROOM_EVENTS.usersData, users);
    }

    getUsersDto = () => {
        return Array.from(this.users, ([name, value]) => (value.toDTO()));
    }

    leave(socket: Socket) {
        const teamId = this.users.get(socket.id)?.teamColor || '' as string;
        const newUserTeam = this.game.leaveTeam(socket.id, teamId);
        if (newUserTeam) {
            const user = this.users.get(newUserTeam.userId)
            if (user) {
                console.log('newUserTeam', newUserTeam, user.teamColor);
                user.setTeamColor(newUserTeam.newTeamId);
                const userDto = user.toDTO();
                user.emit(USER_EVENTS.userChanged, userDto);
            }
        }

        this.game.delete(socket.id)

        this.users.delete(socket.id);
        this.sendUsersList();
    }

    emitToRoom(event: string, data: any): void {
        this.io.to(this.roomId).emit(event, data);
    }

    emitToToomButSocket(socket: Socket, event: string, data: any) {
        socket.to(this.roomId).emit(event, data);
    }
}

export default Room;