import axios from 'axios';

const diagramAPI = {
    getGlobalDataFromApi() {
        return axios.get('https://disease.sh/v3/covid-19/historical/all?lastdays=366');
    },
    getLocaleDataFromApi(country) {
        return axios.get(`https://disease.sh/v3/covid-19/historical/${country}?lastdays=366`);
    },
    getLocaleDataPopulationFromApi(country) {
        return axios.get(`https://disease.sh/v3/covid-19/countries/${country}`);
    },
};

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

export { headerAPI, mapAPI, diagramAPI };
