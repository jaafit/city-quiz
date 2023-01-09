import './App.css';
import {useCallback, useState} from "react";
import divisions from './divisions.json'
import CityMap from "./CityMap";
import Keyboard from "./Keyboard";
import useLocalStorageState from "use-local-storage-state";
import _ from "lodash";

function App() {
    const [currentCityIndex, setCurrentCityIndex] = useLocalStorageState('current-division', {defaultValue:0});
    const [rightOrWrong, setRightOrWrong] = useState(false);
    const [, setRightAnswers] = useLocalStorageState('right-answers', {defaultValue:[]});
    const [, setWrongAnswers] = useLocalStorageState('wrong-answers', {defaultValue:[]});

    function onCorrectAnswer() {
        setRightOrWrong('Right');
        setRightAnswers(oldRight => _.uniq([...oldRight, currentCityIndex]))
        setWrongAnswers(oldWrong => oldWrong.filter(a => a !== currentCityIndex));
    }

    function onWrongAnswer() {
        setRightOrWrong('Wrong');
        setWrongAnswers(oldWrong => _.uniq([...oldWrong, currentCityIndex]));
        setRightAnswers(oldRight => oldRight.filter(a => a !== currentCityIndex));
    }

    const nextCity = useCallback(() => {
            setCurrentCityIndex((currentCityIndex+1)%divisions.length);
            setRightOrWrong(false);
    }, [setCurrentCityIndex, currentCityIndex, setRightOrWrong]);


    function prevCity() {
        setCurrentCityIndex(old => (old + divisions.length-1)%divisions.length);
        setRightOrWrong(false);
    }

    return (
    <div>
        <div className="flex flex-row">
            <CityMap
                width="50vh"
                height="100vh"
                highlight={currentCityIndex}
                showNames={true}
            />

            <div className="flex flex-col w-full">
                <header className="App-header">
                    City Quiz
                </header>

                <Keyboard
                    currentCityIndex={currentCityIndex}
                    onCorrectAnswer={onCorrectAnswer}
                    onWrongAnswer={onWrongAnswer}
                    onNext={nextCity}
                    onPrev={prevCity}/>

                {rightOrWrong && <div>
                    <p>{rightOrWrong + ': ' + divisions[currentCityIndex]}</p>
                    <button className="text-xl" onClick={nextCity} >Next</button>

                </div>}
            </div>

        </div>


    </div>
  );
}

export default App;
