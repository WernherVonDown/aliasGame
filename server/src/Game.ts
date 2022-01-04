import { Server, Socket } from "socket.io";
import { IRoomCreate } from "./const/room/types";
import randomColor from 'randomcolor';
import { GAME_EVENTS } from './const/game/GAME_EVENTS';
import User from './User';
import Words from './Words';
import { IWord, ITeamScore } from './const/game/types';
import { WordStatuses } from "./const/word/wordStatuses";

const TIMER_STEP = 100;
const MAX_TIMER_TIME = 1000 * 60 * 5;

class Game {
    private teams: Map<string, string[]>;
    private roomId: string;
    private io: Server;
    private gameStarted: boolean;
    private currentUser: User | null;
    private currentTeamId: string;
    private users: Map<string, User>
    private roundTeams: string[]
    private roundTeamsOrder: string[]
    private currentTimerVal: number;
    private roundTimerId: any;
    private currentIntervalId: any;
    private roundStarted: boolean;
    private words: Words;
    private scores: Map<string, number> = new Map()

    constructor({ roomId, langs, custom }: IRoomCreate, io: Server) {
        this.teams = new Map();
        this.roomId = roomId;
        this.io = io;
        this.gameStarted = false;
        this.currentUser = null;
        this.currentTeamId = '';
        this.users = new Map();
        this.roundTeams = [];
        this.roundTeamsOrder = [];
        this.currentTimerVal = 0;
        this.roundTimerId = 0;
        this.currentIntervalId = 0;
        this.roundStarted = false;
        this.words = new Words(langs, custom);
    }

    setGameStarted(data: boolean) {
        this.gameStarted = data;
    }

    getNextTeamId(): string {
        if (this.roundTeams.length) {
            return this.roundTeams.shift() as string;
        } else {
            this.roundTeams = [...this.roundTeamsOrder];
            return this.roundTeams.shift() as string;
        }
    }

    getTeamId(): string {
        return randomColor();
    }

    subscribe(socket: Socket) {
        socket.on(GAME_EVENTS.startGame, this.onStartGame);
        socket.on(GAME_EVENTS.roundStarted, this.onRoundStarted);
        socket.on(GAME_EVENTS.getWord, this.onGetWord.bind(this, socket));
        socket.on(GAME_EVENTS.wordStatus, this.onWordStatus.bind(this, socket))
    }

    onWordStatus(socket: Socket, data: { word: IWord, status: string }) {
        console.log("onWordStatus")
        this.emitToRoomFromUser(socket, GAME_EVENTS.wordStatus, data);

        if (data.status === WordStatuses.GUESSED) {
            const lastScore = this.scores.get(this.currentTeamId) || 0;
            this.scores.set(this.currentTeamId, lastScore + 1);
            this.sendTeamsScore()
        }

        // const teams = Object.assign({}, ...[...map].map(([k, v]) => ({ [k]: v })))
        // socket.emit(GAME_EVENTS.getWord, word)
    }

    onGetWord(socket: Socket) {
        const word = this.words.getWord()
        console.log("OnGetWord", word)
        socket.emit(GAME_EVENTS.getWord, word)
    }

    setRoundStarted(data: boolean) {
        this.roundStarted = data;
        this.emitToRoom(GAME_EVENTS.roundStarted, data)
    }

    onRoundStarted = () => {
        this.setRoundStarted(true);
        this.startRoundTimer()
    }

    startRoundTimer() {
        this.roundTimerId = setTimeout(() => {
            this.endRound()
        }, MAX_TIMER_TIME);

        this.currentIntervalId = setInterval(() => {
            this.currentTimerVal += TIMER_STEP;
            if (MAX_TIMER_TIME < this.currentTimerVal) {
                return this.endRound()
            }
            this.sendTimerData(this.currentTimerVal);

        }, TIMER_STEP)
    }

    sendTimerData = (value: number) => {
        this.emitToRoom(GAME_EVENTS.gameTimer, value, true)
    }

    endRound() {
        clearTimeout(this.roundTimerId);
        clearInterval(this.currentIntervalId);
        this.currentTimerVal = 0;
        this.sendTimerData(0);
        this.setRoundStarted(false);
        this.nextRound();
    }

    onStartRound() {
        this.startRoundTimer()
    }

    nextRound() {
        const nextTeam = this.getNextTeamId();
        const team = this.teams.get(nextTeam);
        if (!team || !team.length || team.length < 2) {
            if (this.roundTeamsOrder.length) {
                // this.nextRound();
            }
        }

        const everyUserExists = team?.every(uId => this.users.get(uId));

        if (everyUserExists) {
            const nexUserId = team!.find(uId => this.users.get(uId) && !this.users.get(uId)?.active);
            if (nexUserId) {
                this.currentUser?.setActive(false);
                this.setCurrentUserIfNeeded(this.users.get(nexUserId));
                this.initGameWords();
                this.currentTeamId = this.currentUser?.teamColor as string;
            }
        }
    }

    getTeamsIds(): string[] {
        return Object.keys(Object.fromEntries(this.teams.entries()));
    }

    onStartGame = () => {
        if (this.currentUser) {
            this.currentTeamId = this.currentUser.teamColor as string;
            this.roundTeamsOrder = [
                this.currentTeamId,
                ...this.getTeamsIds().filter(e => e !== this.currentTeamId)
            ]
            this.emitToRoom(GAME_EVENTS.startGame, true);
            this.initGameWords();
            this.setGameStarted(true);
            this.sendTeamsScore()

            this.emitToRoom(GAME_EVENTS.changeState, {
                currentUserId: this.currentUser.id,
                currentTeam: this.currentUser.teamColor
            });
        }


    }

    initGameWords = () => {
        const words: IWord[] = this.words.getAllWords()
        // const INIT_WORDS_NUM = 10;
        // for(let i = 0; i < INIT_WORDS_NUM; i++) {
        //     words.push(this.words.getWord())
        // }

        this.currentUser?.emit(GAME_EVENTS.getWords, words);
    }

    add(socket: Socket, user: User) {
        this.subscribe(socket);
        this.users.set(socket.id, user);
        this.setCurrentUserIfNeeded(user)
        if (this.gameStarted) {
            socket.emit(GAME_EVENTS.startGame, true);
            if (this.currentUser) {
                socket.emit(GAME_EVENTS.changeState, {
                    currentUserId: this.currentUser.id,
                    currentTeam: this.currentUser.teamColor
                });
            }
        }
    }

    getNextCurrentUser(): User {
        return {} as User;
    }

    sendTeamsScore = () => {
        const teamIds = this.getTeamsIds();
        const scoreData = teamIds.map((teamId: string): ITeamScore => {
            return {
                teamColor: teamId,
                score: this.scores.get(teamId) || 0
            }
        })

        this.emitToRoom(GAME_EVENTS.teamsScores, scoreData);
    }

    setCurrentUserIfNeeded = (user: User | undefined) => {
        if (!this.currentUser || !this.users.get(this.currentUser.id) || !this.currentUser.active) {
            this.currentUser = user || this.getNextCurrentUser();
            this.emitToRoom(GAME_EVENTS.changeState, {
                currentUserId: this.currentUser.id,
                currentTeam: this.currentUser.teamColor
            });
            this.currentUser.setActive(true);

        }
    }

    delete(socketId: string) {
        if (socketId === this.currentUser?.id) this.endRound()
        this.users.delete(socketId);
    }

    addNewTeam(userId: string): string {
        const teamId = this.getTeamId();
        this.teams.set(teamId, [userId]);
        this.roundTeamsOrder.push(teamId);
        this.scores.set(teamId, 0)
        return teamId;
    }

    tryToAddToExistingRoom(userId: string, ignoreTeamId: string = ''): string {
        let selectedTeamId: string = "";
        console.log('tryToAddToExistingRoom', this.teams)
        this.teams.forEach((e: string[], key: string) => {
            if (e.length < 2 && !selectedTeamId && key !== ignoreTeamId) {
                selectedTeamId = key;
            }
        });

        if (selectedTeamId) {
            const users = this.teams.get(selectedTeamId) || [];
            this.teams.set(selectedTeamId, [...users, userId]);
        }
        return selectedTeamId;
    }

    addUserToTeam(userId: string): string {
        if (this.teams.size) {
            let selectedTeamId: string = this.tryToAddToExistingRoom(userId);
            console.log('AddToTeam', selectedTeamId, !!selectedTeamId)
            if (selectedTeamId) {
                return selectedTeamId;
            }
        }

        return this.addNewTeam(userId);
    }

    checkNotFullPairs = (teamId: string) => {
        const users = this.teams.get(teamId);
        if (users?.length === 1) {
            const userId = users[0];
            const newTeamId = this.tryToAddToExistingRoom(userId, teamId);
            if (newTeamId) {
                const newUsers = (this.teams.get(teamId) || []).filter(
                    (id: string) => id !== userId
                );
                if (newUsers.length) {
                    this.teams.set(teamId, newUsers)
                } else {
                    this.teams.delete(teamId)
                    this.roundTeamsOrder = this.roundTeamsOrder.filter(t => t != teamId)
                }
                return { userId, newTeamId };
            }
        }
    };

    leaveTeam = (userId: string, teamId: string) => {
        const users = (this.teams.get(teamId) || []).filter(
            (id: string) => id !== userId
        );
        console.log('leaveTeam', users, users.length)
        if (!users.length) {
            this.teams.delete(teamId);
        } else {
            this.teams.set(teamId, users);
            return this.checkNotFullPairs(teamId);
        }
    };


    emitToRoom(event: string, data: any, noLog?: boolean): void {
        if (!noLog)
            console.log('emitToRoom', event, data, this.roomId)
        this.io.to(this.roomId).emit(event, data);
    }

    emitToRoomFromUser(socket: Socket, event: string, data: any): void {
        console.log('emitToRoomFromUser', event, data, this.roomId)
        socket.to(this.roomId).emit(event, data);
    }
}

export default Game;
