import './CovidList.scss';
import Basic from '../Basic/Basic';
import Store from '../../Store/store';
import { CRITERIONS } from '../../../../common/constants';
import { mapAPI } from '../../../api/api';

export default class CovidList extends Basic {
    #data = [];

    render() {
        const covidList = document.createElement('div');
        const scaleButton = this.createScaleButton(covidList);
        const covidListContainer = document.createElement('div');

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

        const caption = document.createElement('div');
        caption.classList.add('list__container-caption');
        covidListContainer.append(caption);

        const captionCountryName = document.createElement('div');
        captionCountryName.classList.add('list__container-caption-country-name');
        caption.append(captionCountryName);
        captionCountryName.textContent = 'Country';

        const captionValue = document.createElement('div');
        captionValue.classList.add('list__container-caption-country-value');
        caption.append(captionValue);
        captionValue.textContent = 'Value';

        const listBody = document.createElement('div');
        listBody.classList.add('list__container-listbody');
        covidListContainer.append(listBody);

        const table = document.createElement('table');
        table.classList.add('list__container-listbody-table');
        listBody.append(table);

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
            const tr = document.createElement('tr');
            const valueTd = document.createElement('td');
            const countryTd = document.createElement('td');
            valueTd.classList.add('list__container-listbody-table-value-td');
            countryTd.classList.add('list__container-listbody-table-country-td');
            table.append(tr);
            table.append(countryTd);
            table.append(valueTd);
            valueTd.textContent = criterions[CRITERIONS.indexOf(Store.criterion)] || country.cases;
            countryTd.textContent = country.country;
        });
    }

    async getAllAPI() {
        const response = await mapAPI.getAllData();
        if (response.status === 200) {
            this.#data = response.data;
        } else {
            throw new Error('List of countries not received');
        }
    }
}
