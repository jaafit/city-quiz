import {useEffect, useState} from "react";
import useLocalStorageState from "use-local-storage-state";

const Zoomer = ({city, zoom, onZoom, onNext}) => {
    const [zooms, setZooms] = useLocalStorageState('zooms', {defaultValue:{}});

    // listen to keydown
    useEffect(() => {
        const onKey = e => {
            if (e.key === 'Enter') {
                onNext();
                setZooms({...zooms, [city]:zoom});
                onZoom(0);
            }
            else if (+e.key >= 0 && +e.key <= 9)
                onZoom(+e.key);
        }
        document.addEventListener('keydown', onKey, false);
        return () => document.removeEventListener('keydown', onKey)
    }, [zooms, zoom, setZooms, onZoom]);


    return(
        <div>
        </div>)
}

export default Zoomer;