import classnames from "classnames";

const CityMap = ({highlight, opening, ids, paths, closing}) => {

    if (!paths) return null;

    return <div className='relative' >
        {paths.map((city, i) =>
            <div
                key={i}
                className={classnames('absolute', {'text-indigo-700':ids[i] === highlight})}
                dangerouslySetInnerHTML={{__html:opening+city+closing}}/>)}
    </div>
}

export default CityMap;