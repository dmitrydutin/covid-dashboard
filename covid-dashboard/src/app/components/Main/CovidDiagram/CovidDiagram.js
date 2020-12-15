import './CovidDiagram.scss';
import Basic from '../Basic/Basic';

export default class CovidDiagram extends Basic {
    render() {
        const covidDiagram = document.createElement('div');
        const scaleButton = this.createScaleButton(covidDiagram);

        covidDiagram.classList.add('covid-diagram');

        covidDiagram.append(scaleButton);

        return covidDiagram;
    }
}
