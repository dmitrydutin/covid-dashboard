import './CovidDiagram.scss';
import ApexCharts from 'apexcharts';
import Basic from '../Basic/Basic';
import LeftArrow from '../../../../assets/images/left-arrow-diagram.svg';
import RightArrow from '../../../../assets/images/right-arrow-diagram.svg';
import constants from '../../../../common/constants';
// import Store from '../../Store/store';

export default class CovidDiagram extends Basic {
    #dataCasesValue = [];
    #dataDeathsValue = [];
    #dataRecoveredValue = [];
    #dataDate = [];
    #country = null;

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
        // await this.getLocaleDataFromApi();

        const optionsCases = {
            colors: ['#8a85ff'],
            title: {
                text: 'Global Cases',
            },
            series: [{
                name: 'Global Cases',
                data: this.#dataCasesValue[0],
            }],
            xaxis: {
                categories: this.#dataDate[0],
            },
        };

        const optionsDeaths = {
            colors: ['#dd0e45'],
            title: {
                text: `${this.#country || 'Global'} Deaths`,
            },
            series: [{
                name: `${this.#country || 'Global'} Deaths`,
                data: this.#dataDeathsValue[0],
            }],
            xaxis: {
                categories: this.#dataDate[0],
            },
        };

        const optionsRecovered = {
            colors: ['#0edd5d'],
            title: {
                text: `${this.#country || 'Global'} Recovered`,
            },
            series: [{
                name: `${this.#country || 'Global'} Recovered`,
                data: this.#dataRecoveredValue[0],
            }],
            xaxis: {
                categories: this.#dataDate[0],
            },
        };

        const optionsRecoveredByHundred = {
            colors: ['#0edd5d'],
            title: {
                text: `${this.#country || 'Global'} Recovered/100K`,
            },
            series: [{
                name: `${this.#country || 'Global'} Recovered/100K`,
                data: this.#dataRecoveredValue[0]
                    .map((el) => Math.round((el / 7753933875) * 1000000)),
            }],
            xaxis: {
                categories: this.#dataDate[0],
            },
        };

        const optionsDeathsByHundred = {
            colors: ['#dd0e45'],
            title: {
                text: `${this.#country || 'Global'} Deaths/100K`,
            },
            series: [{
                name: `${this.#country || 'Global'} Deaths/100K`,
                data: this.#dataDeathsValue[0]
                    .map((el) => Math.round((el / 7753933875) * 1000000)),
            }],
            xaxis: {
                categories: this.#dataDate[0],
            },
        };

        const optionsCasesByHundred = {
            colors: ['#8a85ff'],
            title: {
                text: `${this.#country || 'Global'} Cases/100K`,
            },
            series: [{
                name: `${this.#country || 'Global'} Cases/100K`,
                data: this.#dataCasesValue[0]
                    .map((el) => Math.round((el / 7753933875) * 1000000)),
            }],
            xaxis: {
                categories: this.#dataDate[0],
            },
        };

        const optionsRecoveredByHundredDaily = {
            colors: ['#0edd5d'],
            title: {
                text: `${this.#country || 'Global'} Daily Recovered/100K`,
            },
            series: [{
                name: `${this.#country || 'Global'} Daily Recovered/100K`,
                data: this.#dataRecoveredValue[0]
                    .map((el) => Math.round((el / 7753933875) * 1000000))
                    .map((el, index) => this.#dataRecoveredValue[0][index + 1]
                        - this.#dataRecoveredValue[0][index]).filter((el) => el > 0),
            }],
            xaxis: {
                categories: this.#dataDate[0],
            },
        };

        const optionsDeathsByHundredDaily = {
            colors: ['#dd0e45'],
            title: {
                text: `${this.#country || 'Global'} Daily Deaths/100K`,
            },
            series: [{
                name: `${this.#country || 'Global'} Daily Deaths/100K`,
                data: this.#dataDeathsValue[0]
                    .map((el) => Math.round((el / 7753933875) * 1000000))
                    .map((el, index) => this.#dataDeathsValue[0][index + 1]
                        - this.#dataDeathsValue[0][index]),
            }],
            xaxis: {
                categories: this.#dataDate[0],
            },
        };

        const optionsCasesByHundredDaily = {
            colors: ['#8a85ff'],
            title: {
                text: `${this.#country || 'Global'} Daily Cases/100K`,
            },
            series: [{
                name: `${this.#country || 'Global'} Daily Cases/100K`,
                data: this.#dataCasesValue[0]
                    .map((el) => Math.round((el / 7753933875) * 1000000))
                    .map((el, index) => this.#dataCasesValue[0][index + 1]
                        - this.#dataCasesValue[0][index]),
            }],
            xaxis: {
                categories: this.#dataDate[0],
            },
        };

        const optionsRecoveredDaily = {
            colors: ['#0edd5d'],
            title: {
                text: `${this.#country || 'Global'} Daily Recovered`,
            },
            series: [{
                name: `${this.#country || 'Global'} Daily Recovered`,
                data: this.#dataRecoveredValue[0]
                    .map((element, index) => this.#dataRecoveredValue[0][index + 1]
                        - this.#dataRecoveredValue[0][index]).filter((el) => el > 0),
            }],
            xaxis: {
                categories: this.#dataDate[0],
            },
        };

        const optionsDeathsDaily = {
            colors: ['#dd0e45'],
            title: {
                text: `${this.#country || 'Global'} Daily Deaths`,
            },
            series: [{
                name: `${this.#country || 'Global'} Daily Deaths`,
                data: this.#dataDeathsValue[0]
                    .map((element, index) => this.#dataDeathsValue[0][index + 1]
                        - this.#dataDeathsValue[0][index]),
            }],
            xaxis: {
                categories: this.#dataDate[0],
            },
        };

        const optionsCasesDaily = {
            colors: ['#8a85ff'],
            title: {
                text: `${this.#country || 'Global'} Daily Cases`,
            },
            series: [{
                name: `${this.#country || 'Global'} Daily Cases`,
                data: this.#dataCasesValue[0]
                    .map((element, index) => this.#dataCasesValue[0][index + 1]
                        - this.#dataCasesValue[0][index]),
            }],
            xaxis: {
                categories: this.#dataDate[0],
            },
        };

        const options = [
            optionsCases,
            optionsDeaths,
            optionsRecovered,
            optionsCasesByHundred,
            optionsDeathsByHundred,
            optionsRecoveredByHundred,
            optionsCasesByHundredDaily,
            optionsDeathsByHundredDaily,
            optionsRecoveredByHundredDaily,
            optionsCasesDaily,
            optionsDeathsDaily,
            optionsRecoveredDaily,
        ];

        const chart = new ApexCharts(document.querySelector('#chart'), {
            colors: ['#8a85ff'],
            theme: {
                mode: 'dark',
            },
            chart: {
                type: 'area',
                defaultLocale: 'en',
                toolbar: {
                    show: true,
                    offsetX: 0,
                    offsetY: 0,
                    tools: {
                        download: false,
                        selection: false,
                        zoom: false,
                        zoomin: false,
                        zoomout: false,
                        pan: false,
                        reset: false,
                        customIcons: [{
                            icon: `<img src=${LeftArrow} width="17">`,
                            title: 'Prev category',
                            class: 'prev-category-icon',
                            click() {
                                if (constants.diagramClickCounter === 0) {
                                    constants.diagramClickCounter += 12;
                                }
                                constants.diagramClickCounter -= 1;
                                chart.updateOptions(options[constants.diagramClickCounter]
                                    || options[constants.diagramClickCounter % 12]);
                            },
                        },
                        {
                            icon: `<img src=${RightArrow} width="17">`,
                            title: 'Next category',
                            class: 'next-category-icon',
                            click() {
                                constants.diagramClickCounter += 1;
                                chart.updateOptions(options[constants.diagramClickCounter]
                                    || options[constants.diagramClickCounter % 12]);
                            },
                        },
                        ],
                    },
                },
            },
            title: {
                text: 'Global Cases',
                align: 'center',
                margin: 10,
                style: {
                    fontSize: '14px',
                    fontWeight: 'bold',
                    fontFamily: 'Roboto',
                    color: '#ffffff',
                },
            },
            dataLabels: {
                enabled: false,
            },
            series: [{
                name: 'cases',
                data: this.#dataCasesValue[0],
            }],
            xaxis: {
                type: 'datetime',
                categories: this.#dataDate[0],
            },
        });
        chart.render();
    }

    async getGlobalDataFromAPI() {
        const response = await fetch('https://disease.sh/v3/covid-19/historical/all?lastdays=366');
        const data = await response.json();
        this.#dataCasesValue.push(Object.values(data.cases));
        this.#dataDeathsValue.push(Object.values(data.deaths));
        this.#dataRecoveredValue.push(Object.values(data.recovered));
        this.#dataDate.push(Object.keys(data.cases));
    }

    // async getLocaleDataFromApi() {
    //     const responce = await fetch('https://disease.sh/v3/covid-19/countries');
    //     const data = await responce.json();
    // }
}
