/* eslint-disable import/prefer-default-export */
import axios from 'axios';

const mapAPI = {
    getAllData() {
        return axios.get('https://disease.sh/v3/covid-19/countries');
    },
};
export { mapAPI };
