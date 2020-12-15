import './CovidMap.scss';

import '../../../../../node_modules/leaflet/dist/leaflet.css';

import L from 'leaflet';
import marker from 'leaflet/dist/images/marker-icon.png';
import marker2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

import Basic from '../Basic/Basic';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: marker2x,
    iconUrl: marker,
    shadowUrl: markerShadow,
});

const accessToken = 'sk.eyJ1IjoiYXNiYXJuIiwiYSI6ImNraW16YjR6czAzeXoyeW95cHUya3djdTIifQ.nhucE6in6G6-Np4PI-CyFA';

export default class CovidMap extends Basic {
    // рендерит попап с данными для страны
    renderPopup(elem, criterion) {
        const countryContainer = document.createElement('div');
        const countryFlag = document.createElement('img');
        countryFlag.style.width = '100px';
        countryFlag.style.width = '30px';
        countryFlag.src = `${elem.countryInfo.flag}`;
        const countryName = document.createTextNode(`  ${elem.country}`);
        const countryCriterion = document.createElement('p');
        countryCriterion.textContent = (`${criterion.charAt(0).toUpperCase()}${criterion.slice(1)}: ${elem[criterion]}`);
        countryContainer.appendChild(countryFlag);
        countryContainer.appendChild(countryName);
        countryContainer.appendChild(countryCriterion);
        return countryContainer;
    }

    render() {
        const covidMap = document.createElement('div');
        const scaleButton = this.createScaleButton(covidMap);

        covidMap.classList.add('covid-map');

        covidMap.append(scaleButton);

        covidMap.id = 'mapid';
        // I need to have rendered in document node, to install map in it
        document.body.appendChild(covidMap);

        const mymap = L.map('mapid', {
            worldCopyJump: true,
            zoom: 15,
            maxZoom: 20,
            minZoom: 2,
            accessToken,
            continuousWorld: false,
        }).setView([0, 50], 2);

        const CartoDBDarkMatter = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            subdomains: 'abcd',
            accessToken,
        });
        CartoDBDarkMatter.addTo(mymap);

        //
        // mymap.invalidateSize();
        setTimeout(() => { mymap.invalidateSize(); }, 500);
        fetch('https://disease.sh/v3/covid-19/countries').then((response) => response.json()).then((data) => {
            console.log(data);

            // find max cases
            const maxCases = data.reduce(
                (prev, current) => ((prev.cases > current.cases) ? prev : current),
            ).cases;

            // fetch data, render circles for all countries with popups
            data.forEach((element) => {
                const circle = L.circle([element.countryInfo.lat, element.countryInfo.long],
                    {
                        color: '#BC0000',
                        fillColor: '#BC0000',
                        fillOpacity: 1,
                        radius: 1000000 * (element.cases / maxCases), // draw by percentage
                    });

                circle.bindPopup(this.renderPopup(element, 'cases'));
                circle.on('mouseover', function () {
                    this.openPopup();
                });
                circle.on('mouseout', function () {
                    this.closePopup();
                });

                // change country in table
                circle.addEventListener('click', () => { this.setCountry(element.country); });
                circle.addTo(mymap);
            });
        });

        return covidMap;
    }
}
