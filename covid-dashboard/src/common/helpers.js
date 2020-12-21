function countryInclude(countries, countryName) {
    return (
        countries.findIndex((country) => {
            const firstCountry = country.country;
            const secondCountry = countryName;
            return firstCountry === secondCountry;
        }) !== -1
    );
}

function excludeCountries(countries, prohibitedCountries) {
    return countries.filter((country) => !prohibitedCountries.includes(country.country));
}

export { countryInclude, excludeCountries };
