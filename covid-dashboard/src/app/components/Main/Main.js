import './Main.scss';
import CovidList from './CovidList/CovidList';
import CovidMap from './CovidMap/CovidMap';
import CovidTable from './CovidTable/CovidTable';
import CovidDiagram from './CovidDiagram/CovidDiagram';

export default class Main {
    render() {
        const main = document.createElement('main');
        const covidList = new CovidList().render();
        const covidMap = new CovidMap().render();
        const covidTable = new CovidTable().render();
        const covidDiagram = new CovidDiagram().render();

        main.classList.add('main');

        main.append(covidList);
        main.append(covidMap);
        main.append(covidTable);
        main.append(covidDiagram);

        return main;
    }
}
