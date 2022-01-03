import { WordStatuses } from "./WORD_STATUSES";

export interface IWordData {
    foreignLang: string;
    motherLang: string;
    oneWord?: boolean;
}

export interface IWord extends IWordData{
    status: WordStatuses;
    score?: number;
    id: string;
}