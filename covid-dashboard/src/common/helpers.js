/* eslint-disable import/prefer-default-export */
function countryInclude(countries, countryName) {
    return (
        countries.findIndex((country) => country.name === countryName) !== -1
    );
}

export { countryInclude };
