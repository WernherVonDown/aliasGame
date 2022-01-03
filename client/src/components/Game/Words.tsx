import React, { ReactNode, useEffect, useMemo, useState } from "react"
import styles from './Game.module.scss'
import 'materialize-css';
import { Button, Card, Row, Col, Carousel, ProgressBar } from 'react-materialize';
import classNames from "classnames";
import ProgressBarTimer from '../ProgressBarTimer/ProgressBar';
import { useContext } from 'react';
import { GameContext } from "../../context/game.context";
import { IWord } from '../../const/word/types';
import { WordStatuses } from "../../const/word/WORD_STATUSES";


const bgColors = ['red', 'amber', 'green', 'blue'];
let bgColorsCopy = [...bgColors];
let currentWordId: any;

const Words = (): any => {
    const { state: { words }, actions: { getWord, clearWord, sendWordStatus } } = useContext(GameContext)
    const [elements, setElments] = useState([{ text: 'la chanson - песня', bgColor: 'green', id: '1jnkj12' }, { text: 'le problème - проблема', bgColor: 'blue', id: 'sldfj323' }]);
    // let currentWordId = words[0]?.id || ''
    // let bgColorsCopy = 

    const getBgColor = (): string => {
        if (!bgColorsCopy.length) {
            bgColorsCopy = [...bgColors]
        }

        return 'amber'

        return bgColorsCopy.shift() as string;
    }

    // const getWord = (): string => {
    //     return (Math.random() + 1).toString(36).substring(7);
    // }


    const renderElement = (word: IWord) => {
        const { motherLang, foreignLang, id } = word;
        return <div key={id} data-id={id} className={classNames(getBgColor(), styles.wordItem, 'carousel-item')}>
            <div>{`${foreignLang} - ${motherLang}`}</div>
            <Button className={styles.buttonDone} onClick={() => {
                sendWordStatus(word, WordStatuses.GUESSED);
                next()
                }}>Угадал</Button>
        </div>
    }

    const getElements = () => {
        return words.map(renderElement)
    }

    useEffect(() => {
        console.log('WORDSA', words)
    }, [words])

    const next = () => {
        // const newElements = [...elements];


        //    clearWord()

        // if (words.length < 3)
        console.log('WORD SKIPPED', currentWordId)
        // setTimeout(() => {
        //     clearWord()
        // }, 400)


        //     newElements.shift()
        // newElements.push({ text: getWord(), bgColor: getBgColor(), id: getWord() })
        // console.log('newElements', newElements)
        // setImmediate(() => {

        $('.carousel').carousel('next');

        // setTimeout(getWord, 1000)

        // })

    }

    // const skip = () {
    //     sendWordStatus(word, WordStatuses.GUESSED);
    // }

    console.log('REDNER WORDS')

    const cor = useMemo(() => {
        return <CarouselEl words={words} next={next} sendWordStatus={sendWordStatus}/>
    }, [words])

    return <div className={styles.carouselWrapper}>
        {/* <Carousel
            carouselId="Carousel-35"
            className="white-text center"
            options={{
                fullWidth: true,
                indicators: false,
                noWrap: true,
                onCycleTo: (e: any) => {
                    const wordId: string = e.dataset.id
                    console.log('onCycleTo', wordId)
                    if (wordId && currentWordId !== wordId) {
                        currentWordId = wordId
                    }
                    // getWord()
                },
            }}
        >



            {getElements()}

        </Carousel> */}
        {cor}
        <Button onClick={() => {
            const word = words.find(({id}) => id === currentWordId)
            sendWordStatus(word, WordStatuses.SKIPPED);
            next()
            }} className={styles.buttonNext}>Next</Button>
        <div className={styles.progressBarWrapper}><ProgressBarTimer /></div>
    </div>
}

const CarouselEl = ({words, next, sendWordStatus}: any) => {
    const getBgColor = (): string => {
        if (!bgColorsCopy.length) {
            bgColorsCopy = [...bgColors]
        }

        return 'amber'

        return bgColorsCopy.shift() as string;
    }
    const renderElement = (word: IWord) => {
        const { motherLang, foreignLang, id, oneWord } = word;
        return <div key={id} data-id={id} className={classNames(getBgColor(), styles.wordItem, 'carousel-item')}>
            {oneWord ? <div>{foreignLang}</div> : <div>{`${foreignLang} - ${motherLang}`}</div>}
            <Button className={styles.buttonDone} onClick={() => {
                sendWordStatus(word, WordStatuses.GUESSED);
                next()
                }}>Угадал</Button>
        </div>
    }

    const getElements = () => {
        return words.map(renderElement)
    }

    console.log('RENDER CarouselEl')
const fixed = <Button onClick={next} className={styles.buttonNext}>Next</Button>
    return <Carousel
    carouselId="Carousel-35"
    className="white-text center"
    // fixedItem={fixed}
    options={{
        fullWidth: true,
        indicators: false,
        noWrap: true,
        onCycleTo: (e: any) => {
            const wordId: string = e.dataset.id
            console.log('onCycleTo', wordId)
            if (wordId && currentWordId !== wordId) {
                currentWordId = wordId
                console.log('onCycleTo', currentWordId)
            }
            // getWord()
        },
    }}
>



    {getElements()}

</Carousel>
}

export default Words;