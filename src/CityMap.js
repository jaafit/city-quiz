import classnames from "classnames";
import divisions from './divisions.json'
import useSvg from "./parse-svg";
import useLocalStorageState from "use-local-storage-state";
import zooms from './zooms.json';

const SvgContainer = ({className, html, zoom}) => {

    const viewBox =
        zoom === 1 ? "100 1900 700 1400" :
        zoom === 2 ? "450 1900 700 1400" :
        zoom === 3 ? "800 1900 700 1400" :
        zoom === 4 ? "100 1200 700 1400" :
        zoom === 5 ? "450 1200 700 1400" :
        zoom === 6 ? "800 1200 700 1400" :
        zoom === 7 ? "100 500 700 1400" :
        zoom === 8 ? "450 500 700 1400" :
        zoom === 9 ? "800 500 700 1400" :
        "100 500 1400 2800";

    return <div className={classnames('absolute w-full h-full', className)}>
        <svg
            dangerouslySetInnerHTML={{__html:html}}
            width="100%"
            height="100%"
            viewBox={viewBox}
        />
    </div>
};

const rightColors = ['text-green-100', 'text-green-200', 'text-green-300', 'text-green-400', 'text-green-500',
    'text-green-600', 'text-green-700'];
const wrongColors = ['text-red-100', 'text-red-200', 'text-red-300', 'text-red-400', 'text-red-500',
    'text-red-600', 'text-red-700'];

const CityMap = ({highlightCity, showThisCity, showOtherCities, width, height, zoom}) => {
    const { paths, texts } = useSvg();
    const [answerHistory, ] = useLocalStorageState('history', {defaultValue:{}});
    if (zoom === undefined) zoom = zooms[highlightCity] || 0;

    const highlightIndex = divisions.indexOf(highlightCity);

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
            return <SvgContainer html={path} key={i} zoom={zoom} className={
                    (i === highlightIndex) ? 'text-blue-500' :
                    !answered ? 'text-white' :
                    progressColor}/>
        }
        )}

        {shownTexts.map((text,i) => <SvgContainer html={text.svg} zoom={zoom} key={i}/>)}

    </div>
}

export default CityMap;