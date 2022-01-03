export interface IRoomCreate {
    roomId: string;
    langs: {
        foreignLang: string;
        motherLang: string;
    }
}

export interface ICheckRoomResult {
    result: boolean;
    roomId: string;
}

export interface IEnterRoom {
    roomId: string;
    userName: string
}