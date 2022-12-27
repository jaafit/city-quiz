import {useState} from "react";
import mapSvg from "./map.svg";

const usePaths = () => {
    const [fetching, setFetching] = useState(false);
    const [svgString, setSvgString] = useState('');

    if (!fetching) {
        fetch(mapSvg).then(r => r.text()).then(text => {setSvgString(text)});
        setFetching(true);
    }

    console.log({svgString});
    if (!svgString) return [];

    const opening = svgString.match(/<svg[^>]*>/)[0];
    console.log({opening});
    const closing = '</svg>';

    const paths = svgString.match(/<path[^/]*\/>/sg);
    console.log({paths});

    const ids = paths.map(path => path.match(/id="([^"]*)"/)[1]);
    console.log({ids});

    return {svgString, opening, ids, paths, closing};

}

export default usePaths;