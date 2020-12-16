import './CovidDiagram.scss';
import ApexCharts from 'apexcharts';
import Basic from '../Basic/Basic';
// import Store from '../../Store/store';

export default class CovidDiagram extends Basic {
    #dataCasesValue = [];
    #dataDeathsValue = [];
    #dataRecoveredValue = [];
    #dataCasesKey = [];
    #dataDeathsKey = [];
    #dataRecoveredKey = [];

    render() {
        const covidDiagram = document.createElement('div');
        const scaleButton = this.createScaleButton(covidDiagram);

        covidDiagram.classList.add('covid-diagram');
        covidDiagram.id = 'chart';
        covidDiagram.append(scaleButton);
        this.getDiagram();
        return covidDiagram;
    }

    async getDiagram() {
        await this.getGlobalDataFromAPI();
        await this.getLocaleDataFromApi();
        const optionsCases = {
            colors: ['#8a85ff'],
            theme: {
                mode: 'dark',
            },
            chart: {
                type: 'area',
                defaultLocale: 'en',
            },
            grid: {
                borderColor: '#555',
                clipMarkers: false,
                yaxis: {
                    lines: {
                        show: false,
                    },
                },
            },
            dataLabels: {
                enabled: false,
            },
            fill: {
                type: 'gradient',
                gradient: {
                    shadeIntensity: 1,
                    opacityFrom: 0.55,
                    opacityTo: 0.0,
                    stops: [0, 90, 100],
                },
            },
            series: [{
                name: 'cases',
                data: this.#dataCasesValue[0],
            }],
            xaxis: {
                type: 'datetime',
                categories: this.#dataCasesKey[0],
            },
        };
        const optionsDeaths = {
            colors: ['#8a85ff'],
            theme: {
                mode: 'dark',
            },
            chart: {
                type: 'area',
                defaultLocale: 'en',
            },
            grid: {
                borderColor: '#555',
                clipMarkers: false,
                yaxis: {
                    lines: {
                        show: false,
                    },
                },
            },
            dataLabels: {
                enabled: false,
            },
            fill: {
                type: 'gradient',
                gradient: {
                    shadeIntensity: 1,
                    opacityFrom: 0.55,
                    opacityTo: 0.0,
                    stops: [0, 90, 100],
                },
            },
            series: [{
                name: 'cases',
                data: this.#dataDeathsValue[0],
            }],
            xaxis: {
                type: 'datetime',
                categories: this.#dataDeathsKey[0],
            },
        };
        const optionsRecovered = {
            colors: ['#8a85ff'],
            theme: {
                mode: 'dark',
            },
            chart: {
                type: 'area',
                defaultLocale: 'en',
            },
            grid: {
                borderColor: '#555',
                clipMarkers: false,
                yaxis: {
                    lines: {
                        show: false,
                    },
                },
            },
            dataLabels: {
                enabled: false,
            },
            fill: {
                type: 'gradient',
                gradient: {
                    shadeIntensity: 1,
                    opacityFrom: 0.55,
                    opacityTo: 0.0,
                    stops: [0, 90, 100],
                },
            },
            series: [{
                name: 'cases',
                data: this.#dataRecoveredValue[0],
            }],
            xaxis: {
                type: 'datetime',
                categories: this.#dataRecoveredKey[0],
            },
        };
        const chart = new ApexCharts(document.querySelector('#chart'), optionsDeaths);
        chart.render();
    }

    async getGlobalDataFromAPI() {
        const response = await fetch('https://disease.sh/v3/covid-19/historical/all?lastdays=366');
        const data = await response.json();
        this.#dataCasesValue.push(Object.values(data.cases));
        this.#dataDeathsValue.push(Object.values(data.deaths));
        this.#dataRecoveredValue.push(Object.values(data.recovered));
        this.#dataCasesKey.push(Object.keys(data.cases));
        this.#dataDeathsKey.push(Object.keys(data.deaths));
        this.#dataRecoveredKey.push(Object.keys(data.recovered));
    }

    async getLocaleDataFromApi() {
        const responce = await fetch('https://disease.sh/v3/covid-19/countries');
        const data = await responce.json();
        console.log(data);
    }
}
