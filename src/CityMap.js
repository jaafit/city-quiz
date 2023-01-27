import classnames from "classnames";
import divisions from './divisions.json'
import useSvg from "./parse-svg";
import useLocalStorageState from "use-local-storage-state";

const SvgContainer = ({className, html}) => {
    return <div className={classnames('absolute w-full h-full', className)}>
        <svg
            dangerouslySetInnerHTML={{__html:html}}
            width="100%"
            height="100%"
            viewBox="100 1000 1400 1700"
        />
    </div>
};

const rightColors = ['text-green-50', 'text-green-100', 'text-green-200', 'text-green-300', 'text-green-400', 'text-green-500',
    'text-green-600', 'text-green-700', 'text-green-800', 'text-green-900'];
const wrongColors = ['text-red-50', 'text-red-100', 'text-red-200', 'text-red-300', 'text-red-400', 'text-red-500',
    'text-red-600', 'text-red-700', 'text-red-800', 'text-red-900'];

const CityMap = ({highlightCity, showThisCity, showOtherCities, width, height}) => {
    const { paths, texts } = useSvg();
    const [answerHistory, ] = useLocalStorageState('history', {defaultValue:{}});

    const highlightIndex = divisions.indexOf(highlightCity);
    console.log({highlightIndex});
    console.log({highlightCity});

    if (!paths || !texts) return null; // svg hasn't loaded yet

    const shownTexts = showThisCity ? texts :
            showOtherCities ? texts.filter(text => !highlightCity || text.name !== divisions[highlightIndex])
                : [];

    return <div className='relative' style={{width, height, flexShrink:0}} >
        {paths.map((path, i) =>{
            const cityName = divisions[i];
            const answered = answerHistory[cityName]?.length;
            const recentlyCorrect = answered && answerHistory[cityName][answerHistory[cityName].length-1];
            const numberCorrect = answered && answerHistory[cityName].filter(a => !!a).length;
            const numberWrong = answered && answerHistory[cityName].filter(a => !a).length;

            const progressColor = recentlyCorrect ? rightColors[numberCorrect-1] : wrongColors[numberWrong-1];
            return <SvgContainer html={path} key={i} className={
                    (i === highlightIndex) ? 'text-blue-500' :
                    !answered ? 'text-white' :
                    progressColor}/>
        }
        )}

        {shownTexts.map((text,i) => <SvgContainer html={text.svg} key={i}/>)}

    </div>
}

export default CityMap;