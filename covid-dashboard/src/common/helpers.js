function countryInclude(countries, countryName) {
    return (
        countries.findIndex((country) => {
            const firstCountry = country.country;
            const secondCountry = countryName;
            return firstCountry === secondCountry;
        }) !== -1
    );
}

function removeDuplicateCountries(data) {
    return data.filter((item, index, array) => {
        const countryIndex = array.findIndex(
            (current) => current.country === item.country,
        );
        return countryIndex === index;
    });
}

function excludeCountries(countries, prohibitedCountries) {
    return countries.filter(
        (country) => !prohibitedCountries.includes(country.country),
    );
}

export { countryInclude, removeDuplicateCountries, excludeCountries };
