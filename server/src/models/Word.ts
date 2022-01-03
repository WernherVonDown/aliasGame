import {Schema, model} from 'mongoose';

const Word = new Schema({
    foreignLang: {type: String, unique: false, required: true},
    motherLang: {type: String, unique: false, required: false},
    oneWord: {type: Boolean, required: true},
});

export default model('Word', Word);