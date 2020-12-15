import './Main.scss';
import CovidList from './CovidList/CovidList';
import CovidMap from './CovidMap/CovidMap';
import CovidTable from './CovidTable/CovidTable';
import CovidDiagram from './CovidDiagram/CovidDiagram';

export default class Main {
    #covidList = null;
    #covidMap = null;
    #covidTable = null;
    #covidDiagram = null;

    constructor() {
        this.#covidList = new CovidList().render();
        this.#covidMap = new CovidMap().render();
        this.#covidTable = new CovidTable().render();
        this.#covidDiagram = new CovidDiagram().render();
    }

    render() {
        const main = document.createElement('main');
        main.classList.add('main');

        main.append(this.#covidList);
        main.append(this.#covidMap);
        main.append(this.#covidTable);
        main.append(this.#covidDiagram);

        return main;
    }
}
