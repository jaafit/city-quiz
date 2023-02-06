import {useEffect, useState} from "react";
import _ from "lodash";
import divisions from "./divisions.json";
import themap from './img/themap.svg';

export const useSvg = () => {
    const [svgString, setSvgString] = useState('');
    const [data, setData] = useState({});

    useEffect(() => {
        fetch(themap).then(r => r.text()).then(text => {setSvgString(text)});
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
            .map(res => ({city:res[1], svg:res[0]}))
            .filter(text => !text.svg.includes('#D6D5D5'))
            .map(text => ({...text, svg: text.svg.replace('#343434', 'currentColor')}))
        console.log({texts});

        setData({svgString, opening, paths, centers, texts, closing});
    }, [svgString]);

    return data;

}

const rightColorsTw = ['text-green-100', 'text-green-200', 'text-green-300', 'text-green-400', 'text-green-500',
    'text-green-600', 'text-green-700', 'text-green-800'];
const rightColorsHx = ['#dcfce7', '#bbf7d0', '#86efac','#4ade80','#22c55e','#16a34a','#15803d','#166534'];
const wrongColorsTw = ['text-red-100', 'text-red-200', 'text-red-300', 'text-red-400', 'text-red-500',
    'text-red-600', 'text-red-700', 'text-red-800'];
const wrongColorsHx = ['#fee2e2','#fecaca','#fca5a5','#f87171','#ef4444','#dc2626','#b91c1c','#991b1b'];

export function getColor(cityName, answerHistory, tailwind) {

    const answered = answerHistory[cityName]?.length;
    if (!answered) return tailwind ? 'text-white' : '#FFFFFF';
    const recentlyCorrect = answered && answerHistory[cityName][answerHistory[cityName].length-1];
    const numberCorrect = answered && answerHistory[cityName].filter(a => !!a).length;
    const numberWrong = answered && answerHistory[cityName].filter(a => !a).length;

    const rightColors = tailwind ? rightColorsTw : rightColorsHx;
    const wrongColors = tailwind ? wrongColorsTw : wrongColorsHx;

    const progressColor = numberCorrect > numberWrong ? rightColors[numberCorrect-numberWrong]
        : numberWrong > numberCorrect ? wrongColors[numberWrong-numberCorrect]
            : recentlyCorrect ? rightColors[0]
                : wrongColors[0];

    return !answered ? 'text-white' : progressColor
}

export function prepareSvg(paths, history) {
    let content = '';
    paths.forEach((path, i) => {
        const cityName = divisions[i];
        content += path.replace('currentColor', getColor(cityName, history, false));
    })

    return '<svg xmlns="http://www.w3.org/2000/svg"  viewBox="100 600 1400 2600">' + content + '</svg>';
}