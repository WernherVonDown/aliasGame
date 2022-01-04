import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import config from 'config';
import logger from './utils/logger';
import mongoose from 'mongoose';
import authRouter from './routers/authRouter';
import wordsRouter from './routers/wordsRouter';
import socket from './socket';

const port = config.get<number>('port');
const host = config.get<string>('host');
const db = config.get<any>('db');
const corsOrigin = config.get<string>('corsOrigin');

const corsOptions = {
    origin: corsOrigin,
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }

const app = express();

app.use(express.json());
app.use(cors(corsOptions))
app.use('/auth', authRouter);
app.use('/words', wordsRouter)

const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: corsOrigin,
        credentials: true,
    }
})

app.get('/', (_, res) => {
    res.send('server is up')
})

httpServer.listen(port, host, async () => {
    try {
        logger.info(`Server is listening...`);
        logger.info(`http://${host}:${port}`);
        socket({ io }) 
        await mongoose.connect(`mongodb://${db.user}:${db.password}@${db.url}:${db.port}/${db.database}`)
    } catch (error) {
        logger.info(error)
    }
})