import './CovidTable.scss';
import Basic from '../Basic/Basic';

export default class CovidTable extends Basic {
    render() {
        const covidTable = document.createElement('div');
        const scaleButton = this.createScaleButton(covidTable);

        covidTable.classList.add('covid-table');

        covidTable.append(scaleButton);

        return covidTable;
    }
}
