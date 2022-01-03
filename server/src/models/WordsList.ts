import {Schema, model} from 'mongoose';

const WordsList = new Schema({
    name: {type: String, unique: false, required: true},
    words: [{type: String, ref: 'Word'}],
})

export default model('WordsList', WordsList)