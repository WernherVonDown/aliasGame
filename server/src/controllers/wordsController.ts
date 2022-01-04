import { Request, Response } from 'express';
import { IWord } from '../../../client/src/const/word/types';
import User from '../models/User';
import Word from '../models/Word';
import WordsList from '../models/WordsList';
import log from '../utils/logger';
class WordsController {
    async add(req: Request, res: Response) {
        try {
            const { name, words } = req.body;

            const savedWords = await Promise.all(words.map((w: IWord) => (new Word(w)).save()))
            console.log('BBBBB', savedWords)
            const wordsIds = savedWords.map((w: any) => w._id)
            const wordsList = new WordsList({words: wordsIds, name})
            await wordsList.save()
            //@ts-ignore
            const user = await User.findOne({_id: req?.user.id});
            //@ts-ignore
            console.log('AAAAAAAA', { name, words }, user, req?.user.id)
            
            await User.updateOne(
                //@ts-ignore
                { _id: req?.user.id },
                { 
                    $push: {wordsLists: wordsList._id}}
             )
            if (!user) {
                res.json({success: false, message: 'user not found'})
                return;
            }
    
            // await user.wordsLists.push(wordsList);
            // await user.save()
            console.log('SAVED USER', user)
            res.json({success: true})
        } catch (error) {
            log.error(error);
            res.json({success: false, message: 'error edding words'})
        }
    }

    async get(req: Request, res: Response) {
        try {
            //@ts-ignore
            const user = await User.findOne({_id: req?.user.id}).populate('wordsLists'); 
            if (!user) {
                res.json({success: false, message: 'user not found'})
                return;
            }
            console.log('USER', user)
            const popUser = await user.populate('wordsLists.words'); 
            console.log('GOTTT', popUser)
            res.json({success: true, wordsList: popUser.wordsLists})
        } catch (error) {
            log.error(error);
            res.json({success: false, message: 'error get words'})
        }
    }

}

export default new WordsController()