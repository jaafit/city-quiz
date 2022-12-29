import {useState} from "react";

const CityEntry = ({onSubmit}) => {
    const [cityName, setCityName]= useState('');

    const submit = () => {console.log({onSubmit}); onSubmit(cityName); setCityName('');}

    return (<div>
        <input autoFocus value={cityName} onChange={e => setCityName(e.target.value)} onKeyDown={e => e.key === 'Enter' && submit()}/>
    </div>);
}

export default CityEntry;