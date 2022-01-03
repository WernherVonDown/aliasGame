import {Schema, model} from 'mongoose';

const User = new Schema({
    username: {type: String, unique: false, required: false},
    email: {type: String, unique: true, required: true},
    password: {type: String, unique: false, required: true},
    wordsLists: [{type: String, ref: 'WordsList'}]
})

export default model('User', User)