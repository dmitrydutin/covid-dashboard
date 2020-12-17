/* eslint-disable import/prefer-default-export */
import axios from 'axios';

export const diagramAPI = {
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
