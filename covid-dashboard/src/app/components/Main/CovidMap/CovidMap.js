import './CovidMap.scss';
import Basic from '../Basic/Basic';

export default class CovidMap extends Basic {
    render() {
        const covidMap = document.createElement('div');
        const scaleButton = this.createScaleButton(covidMap);

        covidMap.classList.add('covid-map');

        covidMap.append(scaleButton);

        return covidMap;
    }
}
