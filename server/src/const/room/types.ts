export interface IRoomCreate {
    roomId: string;
    langs: {
        foreignLang: string;
        motherLang: string;
    }
}