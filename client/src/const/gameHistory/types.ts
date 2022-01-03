import { IUser } from "../user/types";
import { IWord } from "../word/types";

export interface IGameHistory {
    user: IUser | any;
    words: IWord[];
}