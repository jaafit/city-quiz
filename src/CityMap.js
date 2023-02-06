import classnames from "classnames";
import divisions from './divisions.json'
import {useSvg, prepareSvg, getColor } from "./svg";
import useLocalStorageState from "use-local-storage-state";
import {useEffect, useState} from "react";
import ShareLogo from './img/share.svg';
import ZoomLogo from './img/magnifier.svg';

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

const CityMap = ({city, highlightCity, showThisCity, showOtherCities, excludedCities, width, height, zoom, onToggleZoom}) => {
    const { paths, centers, texts } = useSvg();
    const [shareUrl, setShareUrl] = useState('');
    const [answerHistory, ] = useLocalStorageState('history', {defaultValue:{}});

    const highlightIndex = divisions.indexOf(city);

    useEffect(() => {
        if (!paths) return;
        let data = new Blob([prepareSvg(paths, answerHistory)], {type: 'img/svg+xml'});
        let url = window.URL.createObjectURL(data);
        setShareUrl(url);
        return () => window.URL.revokeObjectURL(url)
    }, [paths, answerHistory]);


    if (!paths || !texts) return <p className="m-20">Loading map...</p>; // svg hasn't loaded yet

    const includedTexts = texts.filter(text => !excludedCities.includes(text.city))

    const center = centers[highlightIndex];
    const zw = 400;
    const viewBox =
        zoom ? [center.x-zw/2, center.y-zw/2, zw, zw].join(' ') :
            "100 600 1400 2600";

    const shownTexts = showThisCity ? includedTexts :
            showOtherCities ? includedTexts.filter(text => !city || text.city !== divisions[highlightIndex])
                : [];

    return <div className='relative' style={{width, height, flexShrink:0}} >
        {paths.map((path, i) =>{
            const cityName = divisions[i];

            const cityColor  = getColor(cityName, answerHistory, true);

            return <SvgContainer html={path} key={i} viewBox={viewBox} center={centers[city]} className={
                    (highlightCity && i === highlightIndex) ? 'text-blue-500' :
                    cityColor}/>
        })}

        {shownTexts
            .map((text,i) => {
                const rights = answerHistory[text.city]?.filter(a=>a)?.length;
                return <SvgContainer className={rights === 7 ? "text-white" : "text-gray-700"} html={text.svg} viewBox={viewBox} key={i}/>
            })}

        <button className="absolute left-2 bottom-2 rounded p-3 bg-blue-200" >
            <a href={shareUrl} download="nhcities.svg" id="download-link">
                <img className="w-6" alt='share' src={ShareLogo}/>
            </a>
        </button>

        <button className="absolute right-2 bottom-2 rounded p-3 bg-blue-200" onClick={onToggleZoom}>
            <img className="w-6" alt='zoom' src={ZoomLogo}/>
        </button>

    </div>
}

export default CityMap;