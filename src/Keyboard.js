import {useEffect, useState} from "react";
import _ from "lodash";
import classnames from "classnames";

const Key = ({letter, onPress, disabled, md}) => {

    return <button className={classnames(
            "border-gray-300 rounded m-1 text-xl text-color-blue",
            md ? 'p-3' : 'p-2',
            disabled ? "bg-gray-100" : "bg-blue-200")}
        onClick={disabled ? undefined : onPress}>
        {letter}
    </button>

}

const Keyboard = ({tutorial, cities, width, height, currentCity, onCorrectAnswer, onWrongAnswer, onNext, onToggleZoom, md}) => {
    const [entered, setEntered] = useState('');
    const [possibleCharacters, setPossibleCharacters] = useState([]);
    const [disabled, setDisabled] = useState(false);

    const answer = currentCity.replace(' ','').toUpperCase()
    const allAnswers = cities.map(name => name.replace(' ', ''));

    // handle currentCity property change
    useEffect(() => {
        _setEntered('');
        setDisabled(false);
    }, [currentCity]);

    function _setEntered(newEntered) {
        if (answer) {
            if (!answer.startsWith(newEntered)) {
                onWrongAnswer();
                setDisabled(true);
            } else if (newEntered === answer || allAnswers.filter(d => d.toUpperCase().startsWith(newEntered)).length === 1) {
                onCorrectAnswer();
                setDisabled(true);
            }
        }

        setEntered(newEntered);
        // update possible characters
        const pc = _.uniq(
            allAnswers
                .map(name => name.toUpperCase())
                .filter(name => name.startsWith(newEntered))
                .filter(name => name.length > newEntered.length)
                .map(name => name[newEntered.length] === ' ' ? name[newEntered.length+1] : name[newEntered.length]))
        setPossibleCharacters(pc);
    }

    // listen to keydown
    useEffect(() => {
        const onKey = e => {
            if (!disabled) {
                if (~possibleCharacters.indexOf(e.key.toUpperCase()))
                    onAddLetterFn(e.key.toUpperCase())();
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
    }, [disabled, possibleCharacters, onNext, answer, entered]);

    // user added a letter to their guess
    function onAddLetterFn(letter) {
        return () => {
            const  _entered = entered + letter;
            _setEntered(_entered);

        }
    }

    const keys = [['Q', 'W','E','R','T','Y','U','I','O','P'],
        ['A','S','D','F','G','H','J','K','L',"'"],
        ['Z','X','C','V','B','N','M']];

    return(
        <div style={{width,height}} className={md ? "ml-4" : "ml-0"}>
                <p className="text-2xl my-4 text-color-black">
                    {entered || (tutorial ? 'Type the name of the blue city' : '_ _ _ _ _ _ _ _ _ _ _ _ _')}
                </p>
            <div>
                {keys.map((row,i) =>
                    <div key={i} className={classnames("flex flex-row pl-2", {'pl-3': i===1}, {'pl-7': i===2})}>
                        {row.map((letter) =>
                            <Key letter={letter}
                                 key={letter}
                                 md={md}
                                 onPress={onAddLetterFn(letter)}
                                 disabled={disabled || !possibleCharacters.includes(letter)}/>
                        )}
                    </div>
                )}

            </div>



        </div>)
}

export default Keyboard;