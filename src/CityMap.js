import classnames from "classnames";
import divisions from './divisions.json'
import useSvg from "./parse-svg";
import useLocalStorageState from "use-local-storage-state";

const SvgContainer = ({className, html, viewBox}) => {

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
    'text-green-600', 'text-green-700', 'text-green-800'];
const wrongColors = ['text-red-100', 'text-red-200', 'text-red-300', 'text-red-400', 'text-red-500',
    'text-red-600', 'text-red-700', 'text-red-800'];

const CityMap = ({city, highlightCity, showThisCity, showOtherCities, excludedCities, width, height, zoom, onToggleZoom}) => {
    const { paths, centers, texts } = useSvg();
    const [answerHistory, ] = useLocalStorageState('history', {defaultValue:{}});

    const highlightIndex = divisions.indexOf(city);

    if (!paths || !texts) return null; // svg hasn't loaded yet

    const includedTexts = texts.filter(text => !excludedCities.includes(text.name))

    const center = centers[highlightIndex];
    const zw = 400;
    const viewBox =
        zoom ? [center.x-zw/2, center.y-zw/2, zw, zw].join(' ') :
            "100 600 1400 2600";
    console.log({ highlightIndex, viewBox});

    const shownTexts = showThisCity ? includedTexts :
            showOtherCities ? includedTexts.filter(text => !city || text.name !== divisions[highlightIndex])
                : [];

    return <div className='relative' style={{width, height, flexShrink:0}} >
        {paths.map((path, i) =>{
            const cityName = divisions[i];
            const answered = answerHistory[cityName]?.length;
            const recentlyCorrect = answered && answerHistory[cityName][answerHistory[cityName].length-1];
            const numberCorrect = answered && answerHistory[cityName].filter(a => !!a).length;
            const numberWrong = answered && answerHistory[cityName].filter(a => !a).length;

            const progressColor = numberCorrect > numberWrong ? rightColors[numberCorrect-numberWrong]
                : numberWrong > numberCorrect ? wrongColors[numberWrong-numberCorrect]
                : recentlyCorrect ? rightColors[0]
                : wrongColors[0];
            return <SvgContainer html={path} key={i} viewBox={viewBox} center={centers[city]} className={
                    (highlightCity && i === highlightIndex) ? 'text-blue-500' :
                    !answered ? 'text-white' :
                    progressColor}/>
        }
        )}

        {shownTexts
            .map((text,i) => <SvgContainer html={text.svg} viewBox={viewBox} key={i}/>)}

        <button className="absolute right-2 bottom-2 rounded p-4 mt-10 text-xl bg-blue-200" onClick={onToggleZoom}>+</button>

    </div>
}

export default CityMap;