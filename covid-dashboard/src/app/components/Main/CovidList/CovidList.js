import './CovidList.scss';
import Basic from '../Basic/Basic';
import Store from '../../Store/store';
import { CRITERIONS, EXCLUSION_CONTRIES } from '../../../../common/constants';
import { mapAPI } from '../../../api/api';
import { excludeCountries } from '../../../../common/helpers';

export default class CovidList extends Basic {
    #data = [];
    #sortingData = [];
    #isFirstPush = true;

    render() {
        const covidList = document.createElement('div');
        const scaleButton = this.createScaleButton(covidList);
        const covidListContainer = document.createElement('table');

        covidListContainer.classList.add('list__container');
        covidList.append(covidListContainer);

        covidList.classList.add('covid-list');

        Store.subscribeCriterion(this.fillList.bind(this));

        covidList.append(scaleButton);
        this.fillList();
        return covidList;
    }

    fillList() {
        const covidListContainer = document.querySelector('.list__container');
        if (covidListContainer) {
            this.cleanContainer();
        }
        this.buildlist();
    }

    cleanContainer() {
        const covidListContainer = document.querySelector('.list__container');
        while (covidListContainer.firstChild) {
            covidListContainer.removeChild(covidListContainer.firstChild);
        }
    }

    async buildlist() {
        await this.getAllAPI();

        const covidListContainer = document.querySelector('.list__container');

        const caption = document.createElement('thead');
        caption.classList.add('list__container-caption');
        covidListContainer.append(caption);

        const trCaption = document.createElement('tr');
        trCaption.classList.add('list__container-tr-caption');
        caption.append(trCaption);

        const captionCountryName = document.createElement('th');
        captionCountryName.classList.add('list__container-caption-country-name');
        trCaption.append(captionCountryName);
        captionCountryName.textContent = 'Country';

        const captionValue = document.createElement('th');
        captionValue.classList.add('list__container-caption-country-value');
        trCaption.append(captionValue);
        captionValue.textContent = 'Value';

        const listbody = document.createElement('tbody');
        listbody.classList.add('list__container-table-listbody');
        covidListContainer.append(listbody);

        this.#data.forEach((country) => {
            const criterions = [
                country.cases,
                country.deaths,
                country.recovered,
                country.todayCases,
                country.todayDeaths,
                country.todayRecovered,
                Number.isFinite(Math.round((country.cases / country.population) * 100000))
                    ? Math.round((country.cases / country.population) * 100000)
                    : 1,
                Number.isFinite(Math.round((country.deaths / country.population) * 100000))
                    ? Math.round((country.deaths / country.population) * 100000)
                    : 1,
                Number.isFinite(Math.round((country.recovered / country.population) * 100000))
                    ? Math.round((country.recovered / country.population) * 100000)
                    : 1,
                Number.isFinite(Math.round((country.todayCases / country.population) * 100000))
                    ? Math.round((country.todayCases / country.population) * 100000)
                    : 1,
                Number.isFinite(Math.round((country.todayDeaths / country.population) * 100000))
                    ? Math.round((country.todayDeaths / country.population) * 100000)
                    : 1,
                Number.isFinite(Math.round((country.todayRecovered / country.population) * 100000))
                    ? Math.round((country.todayRecovered / country.population) * 100000)
                    : 1,
            ];
            const countryField = country.country;
            const valueField = criterions[CRITERIONS.indexOf(Store.criterion)];
            const valueCasesField = country.cases;
            this.#sortingData.push({
                country: countryField,
                value: this.#isFirstPush ? valueCasesField : valueField,
            });
        });

        this.sortData();
        this.#sortingData = excludeCountries(this.#sortingData, EXCLUSION_CONTRIES);

        this.#isFirstPush = false;

        this.#sortingData.forEach((country) => {
            const tr = document.createElement('tr');
            const valueTd = document.createElement('td');
            const countryTd = document.createElement('td');

            tr.classList.add('list__container-listbody-table-value-tr');
            valueTd.classList.add('list__container-listbody-table-value-td');
            countryTd.classList.add('list__container-listbody-table-country-td');

            valueTd.textContent = country.value;
            countryTd.textContent = country.country;

            listbody.append(tr);
            tr.append(countryTd);
            tr.append(valueTd);
        });

        this.addListenersToListOfCountries();
    }

    addListenersToListOfCountries() {
        const table = document.querySelector('.list__container-table-listbody');
        const listener = function (event) {
            if (event.target.closest('.list__container-listbody-table-country-td') === null) {
                return;
            }
            Store.country = event.target.closest('.list__container-listbody-table-country-td').textContent;
            Store.notify();
        };
        table.removeEventListener('click', listener);
        table.addEventListener('click', listener);
    }

    sortData() {
        this.#sortingData.sort((a, b) => (a.value > b.value ? 1 : -1)).reverse();
    }

    async getAllAPI() {
        const response = await mapAPI.getAllData();
        if (response.status === 200) {
            this.#data = response.data;
            this.#sortingData = [];
        } else {
            throw new Error('List of countries not received');
        }
    }
}
