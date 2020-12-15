import './Main.scss';
import CovidList from './CovidList/CovidList';
import CovidMap from './CovidMap/CovidMap';
import CovidTable from './CovidTable/CovidTable';
import CovidDiagram from './CovidDiagram/CovidDiagram';
import Store from '../Store/store';

export default class Main {
    #main = null;

    render() {
        this.#main = document.createElement('main');
        this.#main.classList.add('main');

        this.#fill(null);
        Store.subscribe(this.#fill.bind(this));

        return this.#main;
    }

    #fill(country) {
        this.#main.innerHTML = '';

        const covidList = new CovidList(country).render();
        const covidMap = new CovidMap(country).render();
        const covidTable = new CovidTable(country).render();
        const covidDiagram = new CovidDiagram(country).render();

        this.#main.append(covidList);
        this.#main.append(covidMap);
        this.#main.append(covidTable);
        this.#main.append(covidDiagram);
    }
}
