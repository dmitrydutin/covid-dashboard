import './Header.scss';

export default class Header {
    render() {
        const header = document.createElement('header');
        header.classList.add('header');

        const logo = this.#createLogo();
        const searchInput = this.#createSearchInput();
        const searchDatalist = this.#createSearchDatalist();

        header.append(logo);
        header.append(searchInput);
        header.append(searchDatalist);

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

        return searchInput;
    }

    #createSearchDatalist() {
        const searchDatalist = document.createElement('datalist');
        searchDatalist.classList.add('header__search-datalist');
        searchDatalist.id = 'search-datalist';

        for (let i = 0; i < 50; i++) {
            const option = document.createElement('option');
            option.value = `Country - ${i + 1}`;
            searchDatalist.append(option);
        }

        return searchDatalist;
    }
}
