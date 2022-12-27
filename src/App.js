import './App.css';
import CityMap from "./CityMap";
import usePaths from "./paths";
import {useEffect, useState} from "react";

function App() {
    const {opening, ids, paths, closing} = usePaths();

    const [city, setCity] = useState('');

    useEffect(() => {
        if (ids && !city) {
            const i = Math.floor(Math.random() * (ids.length-1)) + 1;
            console.log('ids are here', i);
            setCity(ids[i]);
        }
    },[ids, setCity])


    return (
    <div className="App">
      <header className="App-header">
       City Quiz
      </header>
            <CityMap highlight={city} opening={opening} ids={ids} paths={paths} closing={closing} />
        <p>{city}</p>
    </div>
  );
}

export default App;
