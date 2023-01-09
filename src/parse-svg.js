import {useState} from "react";
import mapSvg from "./img/themap.svg";
import _ from "lodash";

const useSvg = () => {
    const [fetching, setFetching] = useState(false);
    const [svgString, setSvgString] = useState('');

    if (!fetching) {
        fetch(mapSvg).then(r => r.text()).then(text => {setSvgString(text)});
        setFetching(true);
    }

    if (!svgString) return [];

    const opening = svgString.match(/<svg[^>]*>/)[0];
    const closing = '</svg>';

    const transform = '<g transform="matrix(1.333 0 0 -1.333 800 1600)">';
    const paths = svgString.match(/<path[^/]*\/>/sg)
        .map(path => transform + path + '</g>')
        .map(path => path.replace('stroke="#CCCCCC"', 'stroke="#555555"'))
        .filter(path => !~path.indexOf('stroke-dasharray'));

    const texts = _.uniq([...svgString.matchAll(/<g [^\r]*\r\n<text><tspan[^>]*>([^<]*)<\/tspan><\/text>\r\n<\/g>/g)])
        .map(res => ({name:res[1], svg:res[0]}));

    return {svgString, opening, paths, texts, closing};

}

export default useSvg;