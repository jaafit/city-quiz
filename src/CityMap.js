import classnames from "classnames";

const CityMap = ({highlight, paths}) => {

    if (!paths) return null;

    return <div className='relative' >
        {paths.map((path, i) =>
            <div
                key={i}
                className={classnames('absolute', {'text-indigo-700':i === highlight})}
                >
                <svg
                    dangerouslySetInnerHTML={{__html:path}}
                    width="40vh"
                    height="80vh"
                    viewBox="0 1100 1400 1800"
                />
            </div>)}

    </div>
}

export default CityMap;