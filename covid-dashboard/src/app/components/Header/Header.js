import './Header.scss';
import { headerAPI } from '../../api/api';
import Store from '../Store/store';
import { countryInclude } from '../../../common/helpers';
import Datalist from './Datalist/Datalist';
import Keyboard from './Keyboard/Keyboard';

export default class Header {
    #countries = [];

    render() {
        const header = document.createElement('header');
        const logo = this.#createLogo();
        const searchForm = document.createElement('div');
        const searchInput = this.#createSearchInput();
        const searchDatalist = new Datalist(searchInput, []);
        const keyboard = new Keyboard(searchInput).render();
        const themeButton = this.#createThemeButton();

        this.#getCountries().then(() => {
            searchDatalist.config = this.#countries;
            searchDatalist.fill('');
        });

        header.classList.add('header');
        searchForm.classList.add('header__search-form');

        searchForm.append(searchInput);
        searchForm.append(searchDatalist.render());

        header.append(logo);
        header.append(searchForm);
        header.append(keyboard);
        header.append(themeButton);

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

        searchInput.addEventListener('search', () => {
            this.#chooseCountryListener(searchInput.value);
        });

        return searchInput;
    }

    #chooseCountryListener(countryName) {
        if (countryInclude(this.#countries, countryName)) {
            Store.country = countryName;
            Store.notify();
        }
    }

    async #getCountries() {
        const response = await headerAPI.getCountries();

        if (response.status === 200) {
            this.#countries = response.data
                .filter((v, i, a) => a.findIndex((t) => (t.country
                    === v.country)) === i);
        } else {
            throw new Error('List of countries not received');
        }
    }

    #createThemeButton() {
        const themeButton = document.createElement('button');
        themeButton.classList.add('header__theme-button');

        themeButton.addEventListener('click', () => {
            console.log('click');
            themeButton.classList.toggle('active');
        });

        return themeButton;
    }
}
