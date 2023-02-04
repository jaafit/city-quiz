import {useEffect, useState} from "react";
import _ from "lodash";

const Keyboard = ({cities, width, height, currentCity, onCorrectAnswer, onWrongAnswer, onNext, onPrev, onToggleZoom, md}) => {
    const [entered, setEntered] = useState('');
    const [answer, setAnswer] = useState('');
    const [possibleCharacters, setPossibleCharacters] = useState([]);
    const [hideKeys, setHideKeys] = useState(false);

    const allAnswers = cities.map(name => name.replace(' ', ''));

    // handle currentCity property change
    useEffect(() => {
        _setEntered('');
        setAnswer(currentCity.replace(' ',''));
        setHideKeys(false);
    }, [currentCity]);

    function _setEntered(newEntered) {
        if (!answer.startsWith(newEntered)) {
            onWrongAnswer();
            setHideKeys(true);
        } else if (newEntered === answer || allAnswers.filter(d => d.startsWith(newEntered)).length === 1) {
            onCorrectAnswer();
            setHideKeys(true);
        }

        setEntered(newEntered);
        // update possible characters
        const pc = _.uniq(
            allAnswers
                .filter(name => name.startsWith(newEntered))
                .filter(name => name.length > newEntered.length)
                .map(name => name[newEntered.length] === ' ' ? name[newEntered.length+1] : name[newEntered.length])).sort();
        setPossibleCharacters(pc);
    }

    // listen to keydown
    useEffect(() => {
        const onKey = e => {
            if (!hideKeys) {
                if (~possibleCharacters.indexOf(e.key.toUpperCase()))
                    onAddLetterFn(e.key.toUpperCase())();
                else if (~possibleCharacters.indexOf(e.key.toLowerCase()))
                    onAddLetterFn(e.key.toLowerCase())();
            }

            if (e.key === '=' || e.key === '+')
                onToggleZoom();

            if ( e.key === 'Enter') {
                //_setEntered('');
                onNext()
            }
        }
        document.addEventListener('keydown', onKey, false);
        return () => document.removeEventListener('keydown', onKey)
    }, [hideKeys, possibleCharacters, onNext, onPrev, answer, entered]);

    // user added a letter to their guess
    function onAddLetterFn(letter) {
        return () => {
            const  _entered = entered + letter;
            _setEntered(_entered);

        }
    }

    return(
        <div style={{width,height}} className={md ? "ml-20":'ml-4'}>
            <div>
                <p className="text-2xl my-4 text-color-black">{entered || '______________'}</p>
            </div>
            {!hideKeys && <div className="flex flex-row flex-wrap">
                {possibleCharacters.map((letter,i) =>
                    <button className="border-gray-300 bg-blue-200 rounded p-4 mr-2 mb-2 text-xl text-color-blue"
                            key={i}
                            onClick={onAddLetterFn(letter)}>
                        {letter}
                    </button>)}

            </div>}

            <button className="mt-5 mr-20 p-3 border-2 rounded text-xl" onClick={onNext} >Next</button>

        </div>)
}

export default Keyboard;