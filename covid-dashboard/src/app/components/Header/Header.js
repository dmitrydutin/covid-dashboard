import './Header.scss';
import { headerAPI } from '../../api/api';
import Store from '../Store/store';
import { countryInclude } from '../../../common/helpers';
import Keyboard from './Keyboard/Keyboard';

export default class Header {
    #searchDatalist = null;
    #countries = [];

    render() {
        const header = document.createElement('header');
        header.classList.add('header');

        const logo = this.#createLogo();
        const searchInput = this.#createSearchInput();
        const searchDatalist = this.#createSearchDatalist();
        const keyboard = new Keyboard(searchInput, searchDatalist).render();

        header.append(logo);
        header.append(searchInput);
        header.append(searchDatalist);
        header.append(keyboard);

        return header;
    }

    #createLogo() {
        const logo = document.createElement('h1');
        logo.classList.add('header__logo');
        logo.textContent = 'Covid dashboard';
        return logo;
    }

    #createSearchInput() {
        const searchInput = document.createElement('input');
        searchInput.classList.add('header__search-input');

        searchInput.type = 'search';
        searchInput.placeholder = 'Search country...';
        searchInput.setAttribute('list', 'search-datalist');

        searchInput.addEventListener('change', () => {
            this.#chooseCountryListener(searchInput.value);

            console.log('change'); // ! DELETE
        });

        searchInput.addEventListener('search', () => {
            this.#chooseCountryListener(searchInput.value);

            console.log('search'); // ! DELETE
        });

        // ! DELETE
        searchInput.addEventListener('input', () => {
            console.log('input');
        });

        return searchInput;
    }

    #chooseCountryListener(countryName) {
        if (countryInclude(this.#countries, countryName)) {
            console.log('countryName', countryName); // ! DELETE

            Store.country = countryName;
            Store.notify();
        }
    }

    #createSearchDatalist() {
        this.#searchDatalist = document.createElement('datalist');

        this.#searchDatalist.classList.add('header__search-datalist');
        this.#searchDatalist.id = 'search-datalist';
        this.#getCountries();

        return this.#searchDatalist;
    }

    #fillSearchDatalist() {
        this.#countries.forEach((country) => {
            const option = document.createElement('option');
            option.value = country.name;
            this.#searchDatalist.append(option);
        });
    }

    async #getCountries() {
        const response = await headerAPI.getCountries();

        if (response.status === 200) {
            this.#countries = response.data;
            this.#fillSearchDatalist();
        } else {
            throw new Error('List of countries not received');
        }
    }
}
