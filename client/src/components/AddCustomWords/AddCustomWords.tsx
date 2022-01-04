import React, { useContext, useEffect, useState } from "react";
import { Button, TextInput } from "react-materialize";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../../context/auth.context";
import useInput from "../../hooks/useInput";
import MainHeader from "../MainHeader/MainHeader";
import styles from './AddCustomWords.module.scss';
import { UserContext } from "../../context/user.context";

const AddCustomWords = () => {
    const { actions: authActions, state: authState } = useContext(AuthContext);
    const {actions: userActions} = useContext(UserContext)
    const history = useHistory();
    const wordsName = useInput('');
    const word = useInput('');
    const [words, setWords] = useState<string[]>([])
    useEffect(() => {
        console.log('AddCustomWords', authState.loggedIn)
        if (!authState.loggedIn) {
            history.push('/')
        }
    }, [authState.loggedIn])
    const send = () => {
        const r ={
            "name": "user sdfssss dfsdsdfsd", 
            "words": [{
                "foreignLang": "Helloef = sdfs",
                "motherLang": "",
                "oneWord": true},
                {
                "foreignLang": "1231231 sdfsdfs",
                "motherLang": "sdfsd sdf",
                "oneWord": false}
            ]
        }
        const userWords = words.map(w => {
            return {
                foreignLang: w,
                motherLang: '',
                oneWord: true,
            }
        })

        const wordsData = {
            name: wordsName.value,
            words: userWords
        }

        userActions.addCustomWords(wordsData);
    }
    
    const onAddWord = () => {
        if (!word.value.length) {
            return alert('Заполните поле')
        }

        setWords([...words, word.value])
        word.clear()
    }
    return <div className={styles.content}>
        <MainHeader />
        <div className={styles.formWrapper}>
            <div className={styles.titleText}>Добавте свои слова</div>
            <div className="input-field col s6">
                <input {...wordsName} id="wordsname_input" type="text" className="" />
                <label htmlFor="wordsname_input">Название списка</label>
            </div>
            <div>
            <div className="input-field col s6">
                <input {...word} id="wordsname_input" type="text" className="" />
                <label htmlFor="wordsname_input">Введите слово</label>
            </div>
            <Button onClick={onAddWord}>
                Добавить в список
            </Button>
            </div>
            <div>
                {words.map((w, i) => {
                    return <div key={`word_${w}_${i}`}>
                        {w}
                    </div>
                })}
            </div>
            <div className={styles.btnWrapper}>
                <Button onClick={send}>Готово</Button>
                <Button
                    onClick={() => history.push('/')}
                > На главную
                </Button>
            </div>
        </div>
    </div >
}

export default AddCustomWords;