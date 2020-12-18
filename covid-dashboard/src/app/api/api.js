import axios from 'axios';

const headerAPI = {
    getCountries() {
        return axios.get('https://disease.sh/v3/covid-19/countries/');
    },
};

const mapAPI = {
    getAllData() {
        return axios.get('https://disease.sh/v3/covid-19/countries');
    },
};

export { headerAPI, mapAPI };
