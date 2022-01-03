import { Server, Socket } from "socket.io";
import RoomsManager from "./roomsManager";
import log from "./utils/logger";

const EVENTS = {
    connection: 'connection',
    disconnect: 'disconnect'
}

function socket({ io }: { io: Server }) {
    log.info('sockets Enabled');
    new RoomsManager(io);
    io.on(EVENTS.connection, (socket: Socket)=> {
        log.info(`Socket connected ${socket.id}`)
        socket.on('hello', data => log.info(`from client ${data}`))
    })
}

export default socket;