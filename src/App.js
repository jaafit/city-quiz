import './App.css';
import {useState} from "react";
import divisions from './divisions.json'
import CityMap from "./CityMap";
import Keyboard from "./Keyboard";
import useLocalStorageState from "use-local-storage-state";

const startingCities = ['Manchester', 'Nashua', 'Concord', 'Derry', 'Dover', 'Rochester', 'Salem', 'Merrimack',
    'Londonderry', 'Hudson', 'Bedford', 'Keene', 'Portsmouth', 'Goffstown', 'Laconia', 'Hampton', 'Milford', 'Exeter', 'Windham', 'Durham',
    'Hooksett', 'Lebanon', 'Pelham', 'Claremont', 'Somersworth', 'Amherst', 'Hanover', 'Raymond', 'Conway', 'Berlin', 'Newmarket', 'Barrington',
    'Weare', 'Hampstead', 'Franklin', 'Litchfield', 'Seabrook', 'Hollis', 'Bow', 'Plaistow'
];
const startingQueue = startingCities.concat(divisions.filter(d => !~startingCities.indexOf(d)));

function App() {

    const [cityQueue, setCityQueue] = useLocalStorageState('city-queue', {defaultValue:startingQueue});
    const [rightOrWrong, setRightOrWrong] = useState(false);
    const [history, setHistory] = useLocalStorageState('history', {defaultValue:{}});

    const city = cityQueue[0];
    const corrects = history[city]?.filter(a => !!a).length || 0;

    function recordAnswer(a) {
        setHistory(oldAnswers => ({
            ...oldAnswers,
            [city]: [...(oldAnswers[city]?.slice(-10, 9) || []), a]
        }));
    }

    function onCorrectAnswer() {
        setRightOrWrong('Right');
        recordAnswer(1);
    }

    function onWrongAnswer() {
        setRightOrWrong('Wrong');
        recordAnswer(0);
    }

    function nextCity () {
        setRightOrWrong(false);

        setCityQueue(oldQueue => {
            oldQueue.shift();
            if (corrects === 10) oldQueue.push(city);
            else oldQueue.splice(10+corrects * 10, 0, city);
            return oldQueue;
        });
    }


    return (
    <div>
        <div className="flex flex-row">
            <CityMap
                width="50vh"
                height="100vh"
                highlightCity={city}
                showThisCity={corrects === 0}
                showOtherCities={corrects < 5}
            />

            <div className="flex flex-col w-full">
                <header className="App-header">
                    City Quiz
                </header>

                <Keyboard
                    currentCity={city}
                    onCorrectAnswer={onCorrectAnswer}
                    onWrongAnswer={onWrongAnswer}
                    onNext={nextCity}
                    />

                {rightOrWrong && <div>
                    <p>{rightOrWrong + ': ' + city}</p>
                    <button className="text-xl" onClick={nextCity} >Next</button>

                </div>}
            </div>

        </div>


    </div>
  );
}

export default App;
