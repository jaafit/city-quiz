import './App.css';
import {useEffect, useState} from "react";
import divisions from './divisions.json'
import CityMap from "./CityMap";
import Keyboard from "./Keyboard";
import useLocalStorageState from "use-local-storage-state";
import _ from "lodash";
import classnames from "classnames";

const startingCities = ['Manchester', 'Nashua', 'Concord', 'Derry', 'Dover', 'Rochester', 'Salem', 'Merrimack',
    'Londonderry', 'Hudson', 'Bedford', 'Keene', 'Portsmouth', 'Goffstown', 'Laconia', 'Hampton', 'Milford', 'Exeter', 'Windham', 'Durham',
    'Hooksett', 'Lebanon', 'Pelham', 'Claremont', 'Somersworth', 'Amherst', 'Hanover', 'Raymond', 'Conway', 'Berlin', 'Newmarket', 'Barrington',
    'Weare', 'Hampstead', 'Franklin', 'Litchfield', 'Seabrook', 'Hollis', 'Bow', 'Plaistow', 'Stratham', 'Gilford', 'Belmont', 'Pembroke', 'Swanzey',
    'Atkinson', 'Epping', 'Farmington', 'Plymouth', 'Meredith'
];

const excludedCities = ["Hale's Location", "Hadley's Purchase", "Thompson and Meserve's Purchase", "Bean's Purchase","Low and Burbank's Grant",
    "Hart's Location","Cutt's Grant","Bean's Grant","Sargent's Purchase","Martin's Location","Pinkham's Grant","Crawford's Purchase",
    "Chandler's Purchase", "Green's Grant", "Second College Grant", "Atkinson and Gilmanton Grant", "Erving's Location", "Wentworth's Location", "Dix's Grant"];

const includedCities = divisions.filter(d => !~startingCities.indexOf(d) && !~excludedCities.indexOf(d));
const startingQueue = startingCities.concat(_.shuffle(includedCities));

function App() {
    const [cityQueue, setCityQueue] = useLocalStorageState('city-queue', {defaultValue:startingQueue});
    const [rightOrWrong, setRightOrWrong] = useState(false);
    const [history, setHistory] = useLocalStorageState('history', {defaultValue:{}});
    const [zoom, setZoom] = useState(true);
    const [showPercent, setShowPercent] = useState(false);
    const [sm, setSm] = useState(
        window.matchMedia("(min-width: 576px)").matches
    );
    const [md, setMd] = useState(
        window.matchMedia("(min-width: 768px)").matches
    );

    useEffect(() => {
        window
            .matchMedia("(min-width: 576px)")
            .addEventListener('change', e => setSm(e.matches));
        window
            .matchMedia("(min-width: 768px)")
            .addEventListener('change', e => setMd( e.matches ));
    }, []);

    const city = cityQueue[0];
    let streak = 0;
    history[city]?.forEach(a => a ? streak++ : streak = 0);
    const corrects = history[city]?.filter(a => !!a).length || 0;

    const progress = Object.keys(history)
        .reduce((prev, key) => prev + history[key].filter(a=>a).length, 0)
        / (divisions.length * 7);

    useEffect(() => {
        setCityQueue(oldQueue => oldQueue.filter(city => !~excludedCities.indexOf(city)));
    },[setCityQueue]);

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
        if (!rightOrWrong) return;

        setRightOrWrong(false);

        setCityQueue(oldQueue => {
            oldQueue.shift();
            if (streak >= 6) oldQueue.push(city);
            else if (history[city].length === 1) oldQueue.splice(3, 0, city);
            else oldQueue.splice([3,7,15,31,63,127][streak], 0, city);
            return oldQueue;
        });
    }

    function onClickProgressBar() {
        setShowPercent(true);
        window.setTimeout(() => setShowPercent(false), 3000);
    }

    return (
    <div>
        <div className={classnames("flex h-screen", {"flex-row": md, "flex-col items-center": !md})}>
            <CityMap
                width={md? "50vw" : "50vh"}
                height={md ? "100vh" : '50vh'}
                city={city}
                highlightCity={!rightOrWrong}
                showThisCity={corrects === 0 || !!rightOrWrong}
                showOtherCities={true}
                excludedCities={excludedCities}
                zoom={zoom}
                onToggleZoom={() => setZoom(!zoom)}
            />

            <div className={classnames("flex flex-col justify-between items-center", md ? 'w-1/2 h-full' : 'w-full h-1/2')} >
                <div className="flex flex-col items-center w-full">
                    {md && (
                        <header className="bg-blue-200 text-2xl p-6 w-full">
                            NH City Quiz
                        </header>

                    )}

                    <Keyboard
                        tutorial={progress < 0.01}
                        sm={sm}
                        md={md}
                        cities={cityQueue}
                        currentCity={city}
                        onCorrectAnswer={onCorrectAnswer}
                        onWrongAnswer={onWrongAnswer}
                        onNext={nextCity}
                        onToggleZoom={() => setZoom(!zoom)}
                    />

                    {rightOrWrong && <div className="ml-10 mt-5 flex flex-col">
                        <p className="text-xl font-bold">{rightOrWrong + ': ' + city}</p>
                        <button className="mt-4 p-2 w-full border-2 rounded text-xl" onClick={nextCity} >Next</button>
                    </div>}


                </div>

                <div className="w-full flex flex-col items-center">
                    <div className="flex flex-row w-full px-4" onClick={onClickProgressBar}>
                        <div className="flex-grow m-3 bg-black rounded-lg p-2" >
                            <div className="bg-blue-500 rounded h-1" style={{width:`${progress*100}%`}}/>
                        </div>
                        {showPercent &&
                            <p className="m-2 text-lg font-bold">{Math.floor(progress*100)}%</p>
                        }
                    </div>

                </div>

            </div>

        </div>


    </div>
  );
}

export default App;
