import './CovidDiagram.scss';
import ApexCharts from 'apexcharts';
import Basic from '../Basic/Basic';
import LeftArrow from '../../../../assets/images/left-arrow-diagram.svg';
import RightArrow from '../../../../assets/images/right-arrow-diagram.svg';
import { DIAGRAM_WORD_POPULATION, CRITERIONS } from '../../../../common/constants';
import Store from '../../Store/store';
import { diagramAPI } from '../../../api/api';

export default class CovidDiagram extends Basic {
    #globalDataCasesValue = [];
    #globalDataDeathsValue = [];
    #globalDataRecoveredValue = [];
    #localeDataCasesValue = [];
    #localeDataDeathsValue = [];
    #localeDataRecoveredValue = [];
    #localeDataPopulation = null;
    #covidDiagramContainer = null;
    #dataDate = [];

    render() {
        const covidDiagram = document.createElement('div');
        this.#covidDiagramContainer = document.createElement('div');
        const scaleButton = this.createScaleButton(covidDiagram);

        covidDiagram.classList.add('covid-diagram');
        this.#covidDiagramContainer.classList.add('covid-diagram__container');

        this.fillDiagram();
        Store.subscribe(this.fillDiagram.bind(this));
        Store.subscribeCriterion(this.fillDiagram.bind(this));

        covidDiagram.append(this.#covidDiagramContainer);
        covidDiagram.append(scaleButton);

        return covidDiagram;
    }

    fillDiagram() {
        this.#covidDiagramContainer.innerHTML = '';
        this.buildDiagram();
    }

    createOptions(colorsArg, titleTextArg, dataOptions, animationsArg = { enabled: false }) {
        return {
            chart: {
                animations: animationsArg,
            },
            colors: colorsArg,
            title: {
                text: `${Store.country || 'Global'} ${titleTextArg}`,
            },
            series: [{
                name: `${Store.country || 'Global'} ${titleTextArg}`,
                data: dataOptions,
            }],
            xaxis: {
                categories: this.#dataDate[0],
            },
        };
    }

    async buildDiagram() {
        // eslint-disable-next-line no-use-before-define
        await this.getGlobalDataFromApi();
        await this.getLocaleDataFromApi();
        await this.getLocaleDataPopulationFromApi();
        let diagramClickCounter = 0;

        const options = [
            this.createOptions(['#8a85ff'], 'Cases', Store.country
                ? this.#localeDataCasesValue[0] : this.#globalDataCasesValue[0]),
            this.createOptions(['#dd0e45'], 'Deaths', Store.country
                ? this.#localeDataDeathsValue[0] : this.#globalDataDeathsValue[0]),
            this.createOptions(['#0edd5d'], 'Recovered', Store.country
                ? this.#localeDataRecoveredValue[0] : this.#globalDataRecoveredValue[0]),
            this.createOptions(['#8a85ff'], 'Daily Cases', Store.country
                ? this.#localeDataCasesValue[0]
                    .map((el, index) => this.#localeDataCasesValue[0][index + 1]
                        - this.#localeDataCasesValue[0][index]).map((el) => Math.abs(el))
                : this.#globalDataCasesValue[0]
                    .map((el, index) => this.#globalDataCasesValue[0][index + 1]
                        - this.#globalDataCasesValue[0][index]).map((el) => Math.abs(el))),
            this.createOptions(['#dd0e45'], 'Daily Deaths', Store.country
                ? this.#localeDataDeathsValue[0]
                    .map((el, index) => this.#localeDataDeathsValue[0][index + 1]
                        - this.#localeDataDeathsValue[0][index]).map((el) => Math.abs(el))
                : this.#globalDataDeathsValue[0]
                    .map((el, index) => this.#globalDataDeathsValue[0][index + 1]
                        - this.#globalDataDeathsValue[0][index]).map((el) => Math.abs(el))),
            this.createOptions(['#0edd5d'], 'Daily Recovered', Store.country
                ? this.#localeDataRecoveredValue[0]
                    .map((el, index) => this.#localeDataRecoveredValue[0][index + 1]
                        - this.#localeDataRecoveredValue[0][index]).map((el) => Math.abs(el))
                : this.#globalDataRecoveredValue[0]
                    .map((el, index) => this.#globalDataRecoveredValue[0][index + 1]
                        - this.#globalDataRecoveredValue[0][index]).map((el) => Math.abs(el))),
            this.createOptions(['#8a85ff'], 'Cases/100K', Store.country
                ? this.#localeDataCasesValue[0]
                    .map((el) => Math.round((el / this.#localeDataPopulation) * 1000000))
                : this.#globalDataCasesValue[0]
                    .map((el) => Math.round((el / DIAGRAM_WORD_POPULATION) * 1000000))),
            this.createOptions(['#dd0e45'], 'Deaths/100K', Store.country
                ? this.#localeDataDeathsValue[0]
                    .map((el) => Math.round((el / this.#localeDataPopulation) * 1000000))
                : this.#globalDataDeathsValue[0]
                    .map((el) => Math.round((el / DIAGRAM_WORD_POPULATION) * 1000000))),
            this.createOptions(['#0edd5d'], 'Recovered/100K', Store.country
                ? this.#localeDataRecoveredValue[0]
                    .map((el) => Math.round((el / this.#localeDataPopulation) * 1000000))
                : this.#globalDataRecoveredValue[0]
                    .map((el) => Math.round((el / DIAGRAM_WORD_POPULATION) * 1000000))),
            this.createOptions(['#8a85ff'], 'Daily Cases/100K', Store.country
                ? this.#localeDataCasesValue[0]
                    .map((el) => Math.round((el / this.#localeDataPopulation) * 1000000))
                    .map((el, index) => this.#localeDataCasesValue[0][index + 1]
                        - this.#localeDataCasesValue[0][index]).map((el) => Math.abs(el))
                : this.#globalDataCasesValue[0]
                    .map((el) => Math.round((el / DIAGRAM_WORD_POPULATION) * 1000000))
                    .map((el, index) => this.#globalDataCasesValue[0][index + 1]
                        - this.#globalDataCasesValue[0][index]).map((el) => Math.abs(el))),
            this.createOptions(['#dd0e45'], 'Daily Deaths/100K', Store.country
                ? this.#localeDataDeathsValue[0]
                    .map((el) => Math.round((el / this.#localeDataPopulation) * 1000000))
                    .map((el, index) => this.#localeDataDeathsValue[0][index + 1]
                        - this.#localeDataDeathsValue[0][index]).map((el) => Math.abs(el))
                : this.#globalDataDeathsValue[0]
                    .map((el) => Math.round((el / DIAGRAM_WORD_POPULATION) * 1000000))
                    .map((el, index) => this.#globalDataDeathsValue[0][index + 1]
                        - this.#globalDataDeathsValue[0][index]).map((el) => Math.abs(el))),
            this.createOptions(['#0edd5d'], 'Daily Recovered/100K', Store.country
                ? this.#localeDataRecoveredValue[0]
                    .map((el) => Math.round((el / this.#localeDataPopulation) * 1000000))
                    .map((el, index) => this.#localeDataRecoveredValue[0][index + 1]
                        - this.#localeDataRecoveredValue[0][index]).map((el) => Math.abs(el))
                : this.#globalDataRecoveredValue[0]
                    .map((el) => Math.round((el / DIAGRAM_WORD_POPULATION) * 1000000))
                    .map((el, index) => this.#globalDataRecoveredValue[0][index + 1]
                        - this.#globalDataRecoveredValue[0][index]).map((el) => Math.abs(el))),
        ];

        const chart = new ApexCharts(this.#covidDiagramContainer, {
            colors: ['#8a85ff'],
            theme: {
                mode: 'dark',
            },
            chart: {
                type: 'area',
                defaultLocale: 'en',
                toolbar: {
                    show: true,
                    offsetX: -20,
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
                                if (diagramClickCounter === 0) {
                                    diagramClickCounter += 12;
                                }
                                diagramClickCounter -= 1;
                                Store.criterion = CRITERIONS[options
                                    .indexOf(options[diagramClickCounter])];
                                Store.notifyCriterion();
                                chart.updateOptions(options[diagramClickCounter]);
                            },
                        },
                        {
                            icon: `<img src=${RightArrow} width="17">`,
                            title: 'Next',
                            class: 'next-category-icon',
                            click() {
                                if (diagramClickCounter === 11) {
                                    diagramClickCounter -= 12;
                                }
                                diagramClickCounter += 1;
                                Store.criterion = CRITERIONS[options
                                    .indexOf(options[diagramClickCounter])];
                                Store.notifyCriterion();
                                chart.updateOptions(options[diagramClickCounter]);
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
        if (Store.criterion.name !== 'Total number of cases') {
            chart.updateOptions(options[CRITERIONS.indexOf(Store.criterion)]);
            diagramClickCounter = CRITERIONS.indexOf(Store.criterion);
        }
    }

    async getGlobalDataFromApi() {
        const responce = await diagramAPI.getGlobalDataFromApi();

        if (responce.status === 200) {
            const { data } = responce;
            this.#globalDataCasesValue.push(Object.values(data.cases));
            this.#globalDataDeathsValue.push(Object.values(data.deaths));
            this.#globalDataRecoveredValue.push(Object.values(data.recovered));
            this.#dataDate.push(Object.keys(data.cases));
        } else {
            throw new Error('DiagramGlobalAPI error');
        }
    }

    async getLocaleDataFromApi() {
        if (Store.country) {
            const responce = await diagramAPI.getLocaleDataFromApi(Store.country);
            if (responce.status === 200) {
                const { data } = responce;
                this.#localeDataCasesValue = [];
                this.#localeDataDeathsValue = [];
                this.#localeDataRecoveredValue = [];
                this.#localeDataCasesValue.push(Object.values(data.timeline.cases));
                this.#localeDataDeathsValue.push(Object.values(data.timeline.deaths));
                this.#localeDataRecoveredValue.push(Object.values(data.timeline.recovered));
            } else {
                throw new Error('DiagramLocaleAPI error');
            }
        }
    }

    async getLocaleDataPopulationFromApi() {
        if (Store.country) {
            const responce = await diagramAPI.getLocaleDataPopulationFromApi(Store.country);
            if (responce.status === 200) {
                const { data } = responce;
                this.#localeDataPopulation = null;
                this.#localeDataPopulation = data.population;
            } else {
                throw new Error('DiagramPopulationAPI error');
            }
        }
    }
}
