import axios from 'axios';

/* eslint-disable import/prefer-default-export */
const headerAPI = {
    getCountries() {
        return axios.get('https://restcountries.eu/rest/v2/all?fields=name');
    },
};

export { headerAPI };
