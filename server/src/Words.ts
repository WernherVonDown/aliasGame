import { IWord } from './const/game/types';
import french_russian from './dataSource/langs/french_russian'
import WordsList from './models/WordsList';

interface ILangs {
    [key: string]: IWord[]
}
const LANGS: ILangs = {
    french_russian
}

class Words {
    private foreignLang: string;
    private motherLang: string;
    private custom: string | undefined;
    private wordsSaved: IWord[];
    private words: IWord[];

    constructor({ foreignLang, motherLang }: IWord, custom: string | undefined) {
        this.foreignLang = foreignLang;
        this.motherLang = motherLang;
        this.custom = custom
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

    prepareData = async () => {
        console.log('prepareData', this.custom)
        if (!this.custom) {
            const langKey = `${this.foreignLang}_${this.motherLang}`;
            this.wordsSaved = LANGS[langKey];
        } else {
            const wordslist = await WordsList.findOne({_id: this.custom}).populate('words');
            this.wordsSaved = wordslist.words;
        }
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