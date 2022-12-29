import {useState} from "react";
import mapSvg from "./img/themap.svg";
import _ from "lodash";

const usePaths = () => {
    const [fetching, setFetching] = useState(false);
    const [svgString, setSvgString] = useState('');

    if (!fetching) {
        fetch(mapSvg).then(r => r.text()).then(text => {setSvgString(text)});
        setFetching(true);
    }

    if (!svgString) return [];

    const opening = svgString.match(/<svg[^>]*>/)[0];
    const closing = '</svg>';

    const paths = svgString.match(/<path[^/]*\/>/sg)
        .map(path => '<g transform="matrix(1.333 0 0 -1.333 800 1600)">' + path + '</g>')
        .map(path => path.replace('stroke="#CCCCCC"', 'stroke="#555555"'))
        .filter(path => path.indexOf('stroke-dasharray') === -1);

    const texts = _.uniq([...svgString.matchAll(/<text><tspan[^>]*>([^<]*)<\/tspan>/sg)]
        .map(res => res[1]));

    return {svgString, opening, paths, texts, closing};

}

export default usePaths;