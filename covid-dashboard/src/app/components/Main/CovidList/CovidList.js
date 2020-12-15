import './CovidList.scss';
import Basic from '../Basic/Basic';

export default class CovidList extends Basic {
    render() {
        const covidList = document.createElement('div');
        const scaleButton = this.createScaleButton(covidList);

        covidList.classList.add('covid-list');

        covidList.append(scaleButton);

        return covidList;
    }
}
