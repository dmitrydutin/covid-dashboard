/* eslint-disable import/prefer-default-export */
function countryInclude(countries, countryName) {
    return (
        countries.findIndex((country) => {
            const firstCountry = country.country.toLowerCase();
            const secondCountry = countryName.toLowerCase();
            return firstCountry === secondCountry;
        }) !== -1
    );
}

export { countryInclude };
