import { IWord } from './const/game/types';
import french_russian from './dataSource/langs/french_russian'

interface ILangs {
    [key: string]: IWord[]
}
const LANGS: ILangs = {
    french_russian
}

class Words {
    private foreignLang: string;
    private motherLang: string;
    private wordsSaved: IWord[];
    private words: IWord[];

    constructor({ foreignLang, motherLang }: IWord) {
        this.foreignLang = foreignLang;
        this.motherLang = motherLang;
        this.wordsSaved = [];
        this.words = [];

        this.prepareData();
    }

    shuffle(array: IWord[]): IWord[] {
        let currentIndex = array.length, randomIndex;

        // While there remain elements to shuffle...
        while (currentIndex != 0) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // And swap it with the current element.
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]];
        }

        return array;
    }

    prepareData = () => {
        const langKey = `${this.foreignLang}_${this.motherLang}`;
        this.wordsSaved = LANGS[langKey];
    }

    getAllWords(): IWord[] {
        return [...this.shuffle(this.wordsSaved)]
    }

    getWord(): IWord {
        if (!this.words.length) {
            this.words = [...this.shuffle(this.wordsSaved)];
        }

        return this.words.shift() as IWord;
    }
}

export default Words;