import './App.css';
import {useState} from "react";
import divisions from './divisions.json'
import CityMap from "./CityMap";
import Keyboard from "./Keyboard";
import useLocalStorageState from "use-local-storage-state";
import _ from "lodash";

const startingCities = ['Manchester', 'Nashua', 'Concord', 'Derry', 'Dover', 'Rochester', 'Salem', 'Merrimack',
    'Londonderry', 'Hudson', 'Bedford', 'Keene', 'Portsmouth', 'Goffstown', 'Laconia', 'Hampton', 'Milford', 'Exeter', 'Windham', 'Durham',
    'Hooksett', 'Lebanon', 'Pelham', 'Claremont', 'Somersworth', 'Amherst', 'Hanover', 'Raymond', 'Conway', 'Berlin', 'Newmarket', 'Barrington',
    'Weare', 'Hampstead', 'Franklin', 'Litchfield', 'Seabrook', 'Hollis', 'Bow', 'Plaistow'
];

const endingCities = ["Hale's Location", "Hadley's Purchase", "Thompson and Meserve's Purchase", "Bean's Purchase","Low and Burbank's Grant",
    "Hart's Location","Cutt's Grant","Bean's Grant","Sargent's Purchase","Martin's Location","Pinkham's Grant","Crawford's Purchase",
    "Chandler's Purchase","Green's Grant","Second College Grant","Atkinson and Gilmanton Grant","Erving's Location","Wentworth's Location","Dix's Grant"];

const startingQueue = startingCities.concat(_.shuffle(divisions)
    .filter(d => !~startingCities.indexOf(d) && !~endingCities.indexOf(d)))
    .concat(endingCities);

function App() {
    const [cityQueue, setCityQueue] = useLocalStorageState('city-queue', {defaultValue:startingQueue});
    const [rightOrWrong, setRightOrWrong] = useState(false);
    const [history, setHistory] = useLocalStorageState('history', {defaultValue:{}});

    const city = cityQueue[0];
    let streak = 0;
    history[city]?.forEach(a => a ? streak++ : streak = 0);
    const corrects = history[city]?.filter(a => !!a).length || 0;

    const progress = Object.keys(history)
        .reduce((prev, key) => prev + history[key].filter(a=>a).length, 0)
        / (divisions.length * 7);

    function recordAnswer(a) {
        setHistory(oldAnswers => ({
            ...oldAnswers,
            [city]: [...(oldAnswers[city]?.slice(-6, 7) || []), a]
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
            if (streak === 7) oldQueue.push(city);
            else oldQueue.splice([4,8,16,32,64,128,256][streak], 0, city);
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
                showOtherCities={corrects <= 5}
                zoom={corrects > 5 ? 0 : undefined}
            />

            <div className="flex flex-col w-full justify-between">
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

                    {rightOrWrong && <div className="p-8">
                        <p>{rightOrWrong + ': ' + city}</p>
                        <button className="text-xl" onClick={nextCity} >Next</button>

                    </div>}


                </div>

                <div className="m-4 bg-black rounded-lg p-3" >
                    <div className="bg-blue-500 rounded h-3" style={{width:`${progress*100}%`}}>

                    </div>
                </div>

            </div>

        </div>


    </div>
  );
}

export default App;
