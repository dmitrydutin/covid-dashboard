import axios from 'axios';

const headerAPI = {
    getCountries() {
        return axios.get('https://restcountries.eu/rest/v2/all?fields=name');
    },
};

const mapAPI = {
    getAllData() {
        return axios.get('https://disease.sh/v3/covid-19/countries');
    },
};

export { headerAPI, mapAPI };
