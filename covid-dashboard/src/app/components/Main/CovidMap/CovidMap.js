import './CovidMap.scss';

import 'leaflet/dist/leaflet.css';

import LeafletMap from 'leaflet';
import marker from 'leaflet/dist/images/marker-icon.png';
import marker2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

import Basic from '../Basic/Basic';
import { mapAPI } from '../../../api/api';
import { accessToken } from '../../../../common/constants';

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
    }

    renderButton(mymap, data, name, circleColors, active) {
        const button = document.createElement('button');
        button.classList.add('map-button');
        if (active) button.classList.add('active-button');
        button.textContent = `${name.charAt(0).toUpperCase()}${name.slice(1)}`;

        button.addEventListener('click', () => {
            this.mapMarkers.clearLayers();

            [...document.getElementsByClassName('map-button')].forEach((elem) => {
                elem.classList.remove('active-button');
            });

            button.classList.add('active-button');
            this.drawCircles(mymap, data, name, circleColors);
        });

        return button;
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

    renderButtons(mymap, data) {
        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('button-container');

        const buttonCases = this.renderButton(mymap, data, 'cases', '#BC0000', true);
        const buttonDeaths = this.renderButton(mymap, data, 'deaths', '#ffff0a');
        const buttonRecovered = this.renderButton(mymap, data, 'recovered', '#00bc00');

        buttonContainer.append(buttonDeaths);
        buttonContainer.append(buttonCases);
        buttonContainer.append(buttonRecovered);

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
            continuousWorld: false,
        }).setView([0, 50], 2);

        const CartoDBDarkMatter = LeafletMap.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            subdomains: 'abcd',
            accessToken,
        });

        CartoDBDarkMatter.addTo(mymap);

        setTimeout(() => { mymap.invalidateSize(); }, 500);

        this.#fetchData().then(() => {
            this.#fetchData();
            covidMapContainer.append(this.renderButtons(mymap, this.data));
            this.drawCircles(mymap, this.data, 'cases', '#BC0000');
        });

        return covidMapContainer;
    }

    async #fetchData() {
        const response = await mapAPI.getAllData();

        if (response.status === 200) {
            this.data = response.data;
        } else {
            throw new Error('COVID-19 API FETCH ERROR');
        }
    }
}
