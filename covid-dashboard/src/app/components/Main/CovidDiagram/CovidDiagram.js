import './CovidDiagram.scss';
import ApexCharts from 'apexcharts';
import Basic from '../Basic/Basic';
import LeftArrow from '../../../../assets/images/left-arrow-diagram.svg';
import RightArrow from '../../../../assets/images/right-arrow-diagram.svg';
import constants from '../../../../common/constants';
import Store from '../../Store/store';

export default class CovidDiagram extends Basic {
    #globalDataCasesValue = [];
    #globalDataDeathsValue = [];
    #globalDataRecoveredValue = [];
    #localeDataCasesValue = [];
    #localeDataDeathsValue = [];
    #localeDataRecoveredValue = [];
    #localeDataPopulation = null;
    #dataDate = [];

    render() {
        const covidDiagram = document.createElement('div');
        const scaleButton = this.createScaleButton(covidDiagram);

        covidDiagram.classList.add('covid-diagram');
        covidDiagram.id = 'chart';
        covidDiagram.append(scaleButton);
        this.buildDiagram();
        return covidDiagram;
    }

    async buildDiagram() {
        Store.subscribe(this.rerenderDiagram);
        Store.country = 'America';
        await this.getGlobalDataFromApi();
        await this.getLocaleDataFromApi();
        await this.getLocaleDataPopulationFromApi();
        const optionsCases = {
            colors: ['#8a85ff'],
            title: {
                text: `${Store.country || 'Global'}  Cases`,
            },
            series: [{
                name: `${Store.country || 'Global'}  Cases`,
                data: Store.country
                    ? this.#localeDataCasesValue[0] : this.#globalDataCasesValue[0],
            }],
            xaxis: {
                categories: this.#dataDate[0],
            },
        };

        const optionsDeaths = {
            colors: ['#dd0e45'],
            title: {
                text: `${Store.country || 'Global'} Deaths`,
            },
            series: [{
                name: `${Store.country || 'Global'} Deaths`,
                data: Store.country
                    ? this.#localeDataDeathsValue[0] : this.#globalDataDeathsValue[0],
            }],
            xaxis: {
                categories: this.#dataDate[0],
            },
        };

        const optionsRecovered = {
            colors: ['#0edd5d'],
            title: {
                text: `${Store.country || 'Global'} Recovered`,
            },
            series: [{
                name: `${Store.country || 'Global'} Recovered`,
                data: Store.country
                    ? this.#localeDataRecoveredValue[0] : this.#globalDataRecoveredValue[0],
            }],
            xaxis: {
                categories: this.#dataDate[0],
            },
        };

        const optionsRecoveredByHundred = {
            chart: {
                animations: {
                    enabled: true,
                    easing: 'linear',
                    speed: 300,
                },
            },
            colors: ['#0edd5d'],
            title: {
                text: `${Store.country || 'Global'} Recovered/100K`,
            },
            series: [{
                name: `${Store.country || 'Global'} Recovered/100K`,
                data: Store.country
                    ? this.#localeDataRecoveredValue[0]
                        .map((el) => Math.round((el / this.#localeDataPopulation) * 1000000))
                    : this.#globalDataRecoveredValue[0]
                        .map((el) => Math.round((el / 7753933875) * 1000000)),
            }],
            xaxis: {
                categories: this.#dataDate[0],
            },
        };

        const optionsDeathsByHundred = {
            colors: ['#dd0e45'],
            title: {
                text: `${Store.country || 'Global'} Deaths/100K`,
            },
            series: [{
                name: `${Store.country || 'Global'} Deaths/100K`,
                data: Store.country
                    ? this.#localeDataDeathsValue[0]
                        .map((el) => Math.round((el / this.#localeDataPopulation) * 1000000))
                    : this.#globalDataDeathsValue[0]
                        .map((el) => Math.round((el / 7753933875) * 1000000)),
            }],
            xaxis: {
                categories: this.#dataDate[0],
            },
        };

        const optionsCasesByHundred = {
            colors: ['#8a85ff'],
            title: {
                text: `${Store.country || 'Global'} Cases/100K`,
            },
            series: [{
                name: `${Store.country || 'Global'} Cases/100K`,
                data: Store.country
                    ? this.#localeDataCasesValue[0]
                        .map((el) => Math.round((el / this.#localeDataPopulation) * 1000000))
                    : this.#globalDataCasesValue[0]
                        .map((el) => Math.round((el / 7753933875) * 1000000)),
            }],
            xaxis: {
                categories: this.#dataDate[0],
            },
        };

        const optionsRecoveredByHundredDaily = {
            colors: ['#0edd5d'],
            title: {
                text: `${Store.country || 'Global'} Daily Recovered/100K`,
            },
            series: [{
                name: `${Store.country || 'Global'} Daily Recovered/100K`,
                data: Store.country
                    ? this.#localeDataRecoveredValue[0]
                        .map((el) => Math.round((el / this.#localeDataPopulation) * 1000000))
                        .map((el, index) => this.#localeDataRecoveredValue[0][index + 1]
                            - this.#localeDataRecoveredValue[0][index]).filter((el) => el > 0)
                    : this.#globalDataRecoveredValue[0]
                        .map((el) => Math.round((el / 7753933875) * 1000000))
                        .map((el, index) => this.#globalDataRecoveredValue[0][index + 1]
                            - this.#globalDataRecoveredValue[0][index]).filter((el) => el > 0),
            }],
            xaxis: {
                categories: this.#dataDate[0],
            },
        };

        const optionsDeathsByHundredDaily = {
            chart: {
                animations: {
                    enabled: true,
                    easing: 'linear',
                    speed: 300,
                },
            },
            colors: ['#dd0e45'],
            title: {
                text: `${Store.country || 'Global'} Daily Deaths/100K`,
            },
            series: [{
                name: `${Store.country || 'Global'} Daily Deaths/100K`,
                data: Store.country
                    ? this.#localeDataDeathsValue[0]
                        .map((el) => Math.round((el / this.#localeDataPopulation) * 1000000))
                        .map((el, index) => this.#localeDataDeathsValue[0][index + 1]
                            - this.#localeDataDeathsValue[0][index])
                    : this.#globalDataDeathsValue[0]
                        .map((el) => Math.round((el / 7753933875) * 1000000))
                        .map((el, index) => this.#globalDataDeathsValue[0][index + 1]
                            - this.#globalDataDeathsValue[0][index]),
            }],
            xaxis: {
                categories: this.#dataDate[0],
            },
        };

        const optionsCasesByHundredDaily = {
            chart: {
                animations: {
                    enabled: false,
                },
            },
            colors: ['#8a85ff'],
            title: {
                text: `${Store.country || 'Global'} Daily Cases/100K`,
            },
            series: [{
                name: `${Store.country || 'Global'} Daily Cases/100K`,
                data: Store.country
                    ? this.#localeDataCasesValue[0]
                        .map((el) => Math.round((el / this.#localeDataPopulation) * 1000000))
                        .map((el, index) => this.#localeDataCasesValue[0][index + 1]
                            - this.#localeDataCasesValue[0][index])
                    : this.#globalDataCasesValue[0]
                        .map((el) => Math.round((el / 7753933875) * 1000000))
                        .map((el, index) => this.#globalDataCasesValue[0][index + 1]
                            - this.#globalDataCasesValue[0][index]),
            }],
            xaxis: {
                categories: this.#dataDate[0],
            },
        };

        const optionsRecoveredDaily = {
            chart: {
                animations: {
                    enabled: true,
                    easing: 'linear',
                },
            },
            colors: ['#0edd5d'],
            title: {
                text: `${Store.country || 'Global'} Daily Recovered`,
            },
            series: [{
                name: `${Store.country || 'Global'} Daily Recovered`,
                data: Store.country
                    ? this.#localeDataRecoveredValue[0]
                        .map((element, index) => this.#localeDataRecoveredValue[0][index + 1]
                            - this.#localeDataRecoveredValue[0][index]).filter((el) => el > 0)
                    : this.#globalDataRecoveredValue[0]
                        .map((element, index) => this.#globalDataRecoveredValue[0][index + 1]
                            - this.#globalDataRecoveredValue[0][index]).filter((el) => el > 0),
            }],
            xaxis: {
                categories: this.#dataDate[0],
            },
        };

        const optionsDeathsDaily = {
            colors: ['#dd0e45'],
            title: {
                text: `${Store.country || 'Global'} Daily Deaths`,
            },
            series: [{
                name: `${Store.country || 'Global'} Daily Deaths`,
                data: Store.country
                    ? this.#localeDataDeathsValue[0]
                        .map((element, index) => this.#localeDataDeathsValue[0][index + 1]
                            - this.#localeDataDeathsValue[0][index])
                    : this.#globalDataDeathsValue[0]
                        .map((element, index) => this.#globalDataDeathsValue[0][index + 1]
                            - this.#globalDataDeathsValue[0][index]),
            }],
            xaxis: {
                categories: this.#dataDate[0],
            },
        };

        const optionsCasesDaily = {
            colors: ['#8a85ff'],
            title: {
                text: `${Store.country || 'Global'} Daily Cases`,
            },
            series: [{
                name: `${Store.country || 'Global'} Daily Cases`,
                data: Store.country
                    ? this.#localeDataCasesValue[0]
                        .map((element, index) => this.#localeDataCasesValue[0][index + 1]
                            - this.#localeDataCasesValue[0][index])
                    : this.#globalDataCasesValue[0]
                        .map((element, index) => this.#globalDataCasesValue[0][index + 1]
                            - this.#globalDataCasesValue[0][index]),
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
                            title: 'Prev',
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
                            title: 'Next',
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
                text: `${Store.country || 'Global'}  Cases`,
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
                name: `${Store.country || 'Global'}  Cases`,
                data: Store.country
                    ? this.#localeDataCasesValue[0] : this.#globalDataCasesValue[0],
            }],
            xaxis: {
                type: 'datetime',
                categories: this.#dataDate[0],
            },
        });
        chart.render();
    }

    async getGlobalDataFromApi() {
        const response = await fetch('https://disease.sh/v3/covid-19/historical/all?lastdays=366');
        const data = await response.json();
        this.#globalDataCasesValue.push(Object.values(data.cases));
        this.#globalDataDeathsValue.push(Object.values(data.deaths));
        this.#globalDataRecoveredValue.push(Object.values(data.recovered));
        this.#dataDate.push(Object.keys(data.cases));
    }

    async getLocaleDataFromApi() {
        if (Store.country) {
            const responce = await fetch(`https://disease.sh/v3/covid-19/historical/${Store.country}?lastdays=366`);
            const data = await responce.json();
            this.#localeDataCasesValue.push(Object.values(data.timeline.cases));
            this.#localeDataDeathsValue.push(Object.values(data.timeline.deaths));
            this.#localeDataRecoveredValue.push(Object.values(data.timeline.recovered));
        }
    }

    async getLocaleDataPopulationFromApi() {
        if (Store.country) {
            const responce = await fetch(`https://disease.sh/v3/covid-19/countries/${Store.country}`);
            const data = await responce.json();
            this.#localeDataPopulation = data.population;
            console.log(data.population);
        }
    }

    rerenderDiagram() {
        this.buildDiagram();
        this.render();
    }
}
