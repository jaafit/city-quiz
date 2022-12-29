import './App.css';
import usePaths from "./paths";
import {useState} from "react";
import useLocalStorageState from "use-local-storage-state";
import CityEntry from "./CityEntry";
import CityMap from "./CityMap";

function App() {
    const {opening, ids, paths, texts, closing} = usePaths();
    //const [city, setCity] = useState('');
    const [cityNames, setCityNames] = useLocalStorageState('citynames', {defaultValue:[]});
    const [currentCityIndex, setCurrentCityIndex] = useState(cityNames?.length || 0);

    function onSubmit (name) {
        if (~cityNames.indexOf(name)) {
            console.error('city name already in the list');
            return;
        }
        setCityNames(names => [...names, name]);
        const i = texts.indexOf(name);
        console.log({i});
        if (!~i)
            console.error('city name not found in labels')
        setCurrentCityIndex(currentCityIndex+1);
    }

    return (
    <div className="App">
        <header className="App-header">
            City Quiz
        </header>

        <CityEntry onSubmit={onSubmit} />

        <CityMap highlight={currentCityIndex} opening={opening} ids={ids} paths={paths} closing={closing} />

    </div>
  );
}

export default App;
