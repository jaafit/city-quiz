import {useState} from "react";

const CityEntry = ({onSubmit}) => {
    const [cityName, setCityName]= useState('');

    const submit = () => {console.log({onSubmit}); onSubmit(cityName); setCityName('');}

    return (<div className="p-2 bg-blue-200">
        <input className="m-2"  autoFocus value={cityName} onChange={e => setCityName(e.target.value)} onKeyDown={e => e.key === 'Enter' && submit()}/>
    </div>);
}

export default CityEntry;