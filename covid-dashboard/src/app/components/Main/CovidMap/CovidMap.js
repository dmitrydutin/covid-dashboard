/* eslint-disable no-unused-vars  */
/* eslint-disable no-param-reassign */
import './CovidMap.scss';

import 'leaflet/dist/leaflet.css';

import LeafletMap from 'leaflet';
import marker from 'leaflet/dist/images/marker-icon.png';
import marker2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import Swiper from 'swiper/bundle';
import 'swiper/swiper-bundle.css';
import Store from '../../Store/store';
import Basic from '../Basic/Basic';
import { mapAPI } from '../../../api/api';
import { accessToken, criterions } from '../../../../common/constants';
import { countryInclude } from '../../../../common/helpers';
import LeftArrow from '../../../../assets/images/slider-arrow-left.png';
import RightArrow from '../../../../assets/images/slider-arrow-right.png';

delete LeafletMap.Icon.Default.prototype._getIconUrl;

LeafletMap.Icon.Default.mergeOptions({
    iconRetinaUrl: marker2x,
    iconUrl: marker,
    shadowUrl: markerShadow,
});

export default class CovidMap extends Basic {
    constructor() {
        super();
        this.mapMarkers = LeafletMap.layerGroup();
        this.data = [];
        this.country = undefined;
    }

    renderPopup(elem, criterion) {
        const countryContainer = document.createElement('div');
        const countryFlag = document.createElement('img');
        const countryName = document.createTextNode(`  ${elem.country}`);
        const countryCriterion = document.createElement('p');

        countryFlag.style.width = '100px';
        countryFlag.style.width = '30px';
        countryFlag.src = `${elem.countryInfo.flag}`;
        countryCriterion.textContent = (`${criterion.charAt(0).toUpperCase()}${criterion.slice(1)}: ${elem[criterion]}`);

        countryContainer.append(countryFlag);
        countryContainer.append(countryName);
        countryContainer.append(countryCriterion);

        return countryContainer;
    }

    renderButtons(mymap) {
        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('button-container');
        buttonContainer.classList.add('swiper-container');

        const buttonPrev = document.createElement('img');
        buttonPrev.classList.add('swiper-button-prev');
        buttonPrev.classList.add('button-prev');
        buttonPrev.src = LeftArrow;
        const buttonNext = document.createElement('img');
        buttonNext.classList.add('swiper-button-next');
        buttonNext.classList.add('button-next');
        buttonNext.src = RightArrow;
        const swiperWrapper = document.createElement('div');
        swiperWrapper.classList.add('swiper-wrapper');

        criterions.forEach((elem) => {
            const swiperSlide = document.createElement('div');
            swiperSlide.classList.add('swiper-slide');
            swiperSlide.textContent = elem.name;
            swiperWrapper.append(swiperSlide);
        });

        buttonContainer.append(swiperWrapper);
        buttonContainer.append(buttonPrev);
        buttonContainer.append(buttonNext);
        document.body.append(buttonContainer);
        const swiper = new Swiper(buttonContainer, {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: false,
            navigation: {
                nextEl: buttonNext,
                prevEl: buttonPrev,
            },
        });
        swiper.on('transitionEnd', () => {
            this.#changeCriterion(
                mymap, criterions[swiper.realIndex].value,
                criterions[swiper.realIndex].color,
            );
        });

        return buttonContainer;
    }

    drawCircles(mymap, data, criterion, color) {
        const maxCases = data.reduce(
            (prev, current) => ((prev[criterion] > current[criterion]) ? prev : current),
        )[criterion];

        data.forEach((element) => {
            const circle = LeafletMap.circle([element.countryInfo.lat, element.countryInfo.long],
                {
                    color,
                    fillColor: color,
                    fillOpacity: 1,
                    radius: 1000000 * (element[criterion] / maxCases),
                });

            circle.bindPopup(this.renderPopup(element, criterion));
            circle.on('mouseover', function () {
                this.openPopup();
            });
            circle.on('mouseout', function () {
                this.closePopup();
            });

            this.mapMarkers.addLayer(circle);
        });

        this.mapMarkers.addTo(mymap);
    }

    render() {
        const covidMapContainer = document.createElement('div');
        const covidMap = document.createElement('div');
        const scaleButton = this.createScaleButton(covidMapContainer);

        covidMapContainer.classList.add('covid-map-container');
        covidMapContainer.append(covidMap);
        covidMap.classList.add('covid-map');

        covidMap.id = 'mapid';
        covidMapContainer.append(scaleButton);
        document.body.append(covidMapContainer);

        const mymap = LeafletMap.map('mapid', {
            worldCopyJump: true,
            zoom: 15,
            maxZoom: 20,
            minZoom: 2,
            accessToken,
        }).setView([0, 50], 2);

        const CartoDBDarkMatter = LeafletMap.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            subdomains: 'abcd',
            accessToken,
        });

        CartoDBDarkMatter.addTo(mymap);

        setInterval(() => {
            mymap.invalidateSize();
        }, 500);

        this.#fetchData().then(() => {
            this.#fetchData().then(() => {
                console.log(this.data);
            });
            covidMapContainer.append(this.renderButtons(mymap, this.data));
            this.drawCircles(mymap, this.data, 'cases', '#BC0000');
        });

        mymap.on('click', (e) => {
            this.#fetchCountry(e.latlng.lat, e.latlng.lng)
                .then(() => {
                    console.log(this.country);
                    this.#chooseCountryListener(this.country);
                });
        });

        return covidMapContainer;
    }

    async #fetchData() {
        const response = await mapAPI.getAllData();

        if (response.status === 200) {
            this.data = response.data;
            this.data.forEach((element) => {
                element.casesPer100K = Number.isFinite(
                    Math.round((element.cases * 100000)
                        / element.population),
                ) ? Math.round((element.cases * 100000)
                    / element.population) : 100;

                element.deathsPer100K = Number.isFinite(
                    Math.round((element.deaths * 100000)
                        / element.population),
                ) ? Math.round((element.deaths * 100000)
                    / element.population) : 100;

                element.recoveredPer100K = Number.isFinite(
                    Math.round((element.recovered * 100000)
                        / element.population),
                ) ? Math.round((element.recovered * 100000)
                    / (element.population)) : 100;

                element.todayCasesPer100K = Number.isFinite(
                    Math.round((element.todayCases * 100000)
                        / element.population),
                ) ? Math.round((element.todayCases * 100000)
                    / element.population) : 1;

                element.todayDeathsPer100K = Number.isFinite(
                    Math.round((element.todayDeaths * 100000)
                        / element.population),
                ) ? Math.round((element.todayDeaths * 100000)
                / element.population) : 1;

                element.todayRecoveredPer100K = Number.isFinite(
                    Math.round((element.todayRecovered * 100000)
                        / element.population),
                ) ? Math.round((element.todayRecovered * 100000)
                / element.population) : 1;
            });
        } else {
            throw new Error('COVID-19 API FETCH ERROR');
        }
    }

    async #fetchCountry(lat, lng) {
        const response = await mapAPI.getCountryName(lat, lng);

        if (response.status === 200) {
            this.country = response.data.countryName;
        } else {
            throw new Error('COVID-19 API FETCH ERROR');
        }
    }

    #chooseCountryListener(countryName) {
        if (this.data.map((element) => element.country)
            .findIndex((elem) => elem === countryName) !== -1) {
            Store.country = countryName;
            Store.notify();
        }
    }

    #changeCriterion(mymap, name, circleColors) {
        this.mapMarkers.clearLayers();
        this.drawCircles(mymap, this.data, name, circleColors);
        Store.criterion = criterions.find((elem) => elem.value === name);
        Store.notify();
        console.log(Store);
    }
}
