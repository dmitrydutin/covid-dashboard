/* eslint-disable import/prefer-default-export */
const getAllData = fetch('https://disease.sh/v3/covid-19/countries').then((response) => response.json());

export { getAllData };
