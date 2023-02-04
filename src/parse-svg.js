import {useEffect, useState} from "react";
import mapSvg from "./img/themap.svg";
import _ from "lodash";

const useSvg = () => {
    const [svgString, setSvgString] = useState('');
    const [data, setData] = useState({});

    useEffect(() => {
        fetch(mapSvg).then(r => r.text()).then(text => {setSvgString(text)});
    }, []);

    useEffect(() => {
        if (!svgString) return;

        const opening = svgString.match(/<svg[^>]*>/)[0];
        const closing = '</svg>';

        const transform = [1.33,0,0,-1.33,800,1600];
        const g = '<g transform="matrix('+transform.join(' ')+')">';
        const paths = svgString.match(/<path[^/]*\/>/sg)
            .map(path => g + path + '</g>')
            .map(path => path.replace('stroke="#CCCCCC"', 'stroke="#555555"'))
            .filter(path => !~path.indexOf('stroke-dasharray'));

        const centers = paths.map((path) => {
            const coords = [...path.matchAll(/[LM]([^ ]+) ([^ ]+)/g)];
            const extents = coords
                .reduce((prev, coord) => ({
                    maxX: prev.maxX === undefined ? coord[1] : Math.max(coord[1], prev.maxX),
                    minX: prev.minX === undefined ? coord[1] : Math.min(coord[1], prev.minX),
                    maxY: prev.maxY === undefined ? coord[2] : Math.max(coord[2], prev.maxY),
                    minY: prev.minY === undefined ? coord[2] : Math.min(coord[2], prev.minY),
                }), {});

            const xy = {x: (extents.maxX + extents.minX)/2, y: (extents.maxY + extents.minY)/2};
            return {
                x: transform[0] * xy.x + transform[2] * xy.y + transform[4],
                y: transform[1] * xy.x + transform[3] * xy.y + transform[5],
            };
        })

        const texts = _.uniq([...svgString.matchAll(/<g [^\r]*\r\n<text><tspan[^>]*>([^<]*)<\/tspan><\/text>\r\n<\/g>/g)])
            .map(res => ({name:res[1], svg:res[0]}));

        setData({svgString, opening, paths, centers, texts, closing});
    }, [svgString]);

    return data;

}

export default useSvg;