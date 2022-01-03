export interface IUser {
    userName: string;
    score: number;
    maxScore: number;
    id: string;
    teamColor: string;
    stream?: MediaStream
}