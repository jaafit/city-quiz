import classnames from "classnames";
import usePaths from "./paths";
import useLocalStorageState from "use-local-storage-state";

const CityMap = ({highlight, width, height}) => {
    const { paths } = usePaths();
    const [rightAnswers, ] = useLocalStorageState('right-answers', {defaultValue:[]});
    const [wrongAnswers, ] = useLocalStorageState('wrong-answers', {defaultValue:[]});

    if (!paths) return null;

    return <div className='relative' style={{width, height}} >
        {paths.map((path, i) =>
            <div
                key={i}
                className={classnames(
                    'absolute',
                    (i === highlight) ? 'text-blue-600' :
                        ~wrongAnswers.indexOf(i) ? 'text-red-300' :
                            ~rightAnswers.indexOf(i) ? 'text-green-300': 'text-white'
                )}
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