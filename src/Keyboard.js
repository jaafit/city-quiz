import {useEffect, useState} from "react";
import _ from "lodash";
import classnames from "classnames";

const Key = ({children, onPress, disabled, width, md, sm}) => {

    return <button className={classnames(
            "border-gray-300 rounded text-color-blue p-2",
            md ? 'text-xl' : sm ? 'text-base' : 'text-sm',
            disabled ? "bg-gray-100" : "bg-blue-200")}
                   style={{width}}
        onClick={disabled ? undefined : onPress}>
        {children}
    </button>

}

const bs = '⇦';

const Keyboard = ({tutorial, cities, width, height, currentCity, onCorrectAnswer, onWrongAnswer, onNext, onToggleZoom, sm, md}) => {
    const [entered, setEntered] = useState('');
    const [possibleCharacters, setPossibleCharacters] = useState([]);
    const [disabled, setDisabled] = useState(false);
    const [confirming, setConfirming] = useState(false);

    const answer = currentCity.replace(' ','').toUpperCase()
    const allAnswers = cities.map(name => name.toUpperCase().replace(' ', ''));

    // handle currentCity property change
    useEffect(() => {
        _setEntered('');
        setDisabled(false);
    }, [currentCity]);

    function onConfirmAnswer() {
        if (!answer.startsWith(entered)) {
            onWrongAnswer();
        } else if (entered === answer || allAnswers.filter(d => d.startsWith(entered)).length === 1) {
            onCorrectAnswer();
        }
        setDisabled(true);
        setConfirming(false);
    }

    function _setEntered(newEntered) {
        const possibleCities = allAnswers.filter(d => d.startsWith(newEntered));
        if (possibleCities.length === 1)
            setConfirming(possibleCities[0]);
        else if (allAnswers.includes(newEntered))
            setConfirming(newEntered);
        else
            setConfirming(false);

        setEntered(newEntered);
        // update possible characters
        const pc = _.uniq(
            allAnswers
                .filter(name => name.startsWith(newEntered))
                .filter(name => name.length > newEntered.length)
                .map(name => name[newEntered.length] === ' ' ? name[newEntered.length+1] : name[newEntered.length]));
        if (newEntered.length) pc.push(bs);
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

            if (e.key === 'Backspace' && !disabled)
                _setEntered(entered.slice(0, -1));

            if (e.key === ' ')
                e.preventDefault();

            if ( e.key === 'Enter') {
                e.preventDefault();
                //_setEntered('');
                if (confirming)
                    onConfirmAnswer();
                else
                    onNext();
            }
        }
        document.addEventListener('keydown', onKey, false);
        return () => document.removeEventListener('keydown', onKey)
    }, [disabled, possibleCharacters, onNext, answer, entered]);

    // user added a letter to their guess
    function onAddLetterFn(letter) {
        if (letter === bs)
            return () => _setEntered(entered.slice(0, -1));
        else
            return () => _setEntered(entered + letter);
    }

    const keys = [['Q', 'W','E','R','T','Y','U','I','O','P'],
        ['A','S','D','F','G','H','J','K','L'],
        ['Z','X','C','V','B','N','M', bs]];

    if (allAnswers.some(a => ~a.indexOf("'")))
        keys[1].push("'");

    return(
        <div style={{width,height}} className={classnames('w-full', md ? "mx-4" : "mx-2")}>
                <p className="text-2xl my-4 text-color-black">
                    {entered || (tutorial ? 'Type the name of the blue city' : '_ _ _ _ _ _ _ _ _ _ _ _ _')}
                </p>
            <div>
                {keys.map((row,i) =>
                    <div key={i} className={classnames("flex max-w-full flex-row w-full mt-2 justify-around", {'px-3': i===1}, {'px-5': i===2})}>
                        {row.map((letter) =>
                            <Key letter={letter}
                                 sm={sm}
                                 md={md}
                                 width={Math.floor(100/row.length-1)+'%'}
                                 onPress={onAddLetterFn(letter)}
                                 disabled={disabled || !possibleCharacters.includes(letter)}>
                                {letter}
                            </Key>
                        )}
                    </div>
                )}
            </div>
            {confirming && <div className="w-full mt-3 flex justify-center"><Key onPress={onConfirmAnswer}>{confirming+'?'}</Key></div>}



        </div>)
}

export default Keyboard;