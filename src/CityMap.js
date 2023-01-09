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

const CityMap = ({highlight, showNames, width, height}) => {
    const { paths, texts } = useSvg();
    const [rightAnswers, ] = useLocalStorageState('right-answers', {defaultValue:[]});
    const [wrongAnswers, ] = useLocalStorageState('wrong-answers', {defaultValue:[]});

    if (!paths || !texts) return null; // svg hasn't loaded yet

    const shownTexts = showNames ? texts
        .filter(text => !highlight || text.name !== divisions[highlight]) : [];

    return <div className='relative' style={{width, height, flexShrink:0}} >
        {paths.map((path, i) =>
            <SvgContainer html={path} key={i} className={(i === highlight) ? 'text-blue-600' :
                ~wrongAnswers.indexOf(i) ? 'text-red-300' :
                    ~rightAnswers.indexOf(i) ? 'text-green-300': 'text-white'}/>)}

        {shownTexts.map((text,i) => <SvgContainer html={text.svg} key={i}/>)}

    </div>
}

export default CityMap;