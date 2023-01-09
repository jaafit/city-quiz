import divisions from './divisions.json'
import {useEffect, useState} from "react";
import _ from "lodash";

const Keyboard = ({width, height, currentCityIndex, onCorrectAnswer, onWrongAnswer, onNext, onPrev}) => {
    const [entered, setEntered] = useState('');
    const [answer, setAnswer] = useState('');
    const [possibleCharacters, setPossibleCharacters] = useState([]);
    const [hideKeys, setHideKeys] = useState(false);

    const allAnswers = divisions.map(name => name.replace(' ', ''));

    // update answer
    useEffect(() => {
        setEntered('');
        setAnswer(divisions[currentCityIndex].replace(' ',''));
        setHideKeys(false);
    }, [currentCityIndex, setEntered]);

    // update possible characters
    useEffect( () => {
        const pc = _.uniq(
            allAnswers
                .filter(name => name.startsWith(entered))
                .filter(name => name.length > entered.length)
                .map(name => name[entered.length] === ' ' ? name[entered.length+1] : name[entered.length])).sort();
        setPossibleCharacters(pc);
    }, [entered, setPossibleCharacters]);

    // listen to keydown
    useEffect(() => {
        const onKey = e => {
            if (~possibleCharacters.indexOf(e.key.toUpperCase()))
                onAddLetterFn(e.key.toUpperCase())();
            else if (~possibleCharacters.indexOf(e.key.toLowerCase()))
                onAddLetterFn(e.key.toLowerCase())();

            if (e.key === 'ArrowRight' || e.key === 'Enter') onNext()
            if (e.key === 'ArrowLeft') onPrev()
        }
        document.addEventListener('keydown', onKey, false);
        return () => document.removeEventListener('keydown', onKey)
    }, [possibleCharacters, onNext, onPrev, answer, entered]);

    // user added a letter to their guess
    function onAddLetterFn(letter) {
        return () => {
            setEntered(old => old+letter);

            const  _entered = entered + letter;

            if (!answer.startsWith(_entered)) {
                onWrongAnswer();
                setHideKeys(true);
            } else if (_entered === answer || allAnswers.filter(d => d.startsWith(_entered)).length === 1) {
                onCorrectAnswer();
                setHideKeys(true);
            }
        }
    }

    return(
        <div style={{width,height}} className="ml-20">
            <div>
                <p className="p-4 text-2xl text-color-black">{entered}</p>
            </div>
            {!hideKeys && <div className="flex flex-row flex-wrap">
                {possibleCharacters.map((letter,i) =>
                    <button className="border-gray-300 bg-blue-200 rounded p-4 m-2 text-xl text-color-blue"
                            key={i}
                            onClick={onAddLetterFn(letter)}>
                        {letter}
                    </button>)}

            </div>}
        </div>)
}

export default Keyboard;