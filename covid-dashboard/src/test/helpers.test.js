import { countryInclude, removeDuplicateCountries, sortData } from '../common/helpers';

const countries = [
    { country: 'Afghanistan' },
    { country: 'Albania' },
    { country: 'Algeria' },
    { country: 'Andorra' },
    { country: 'Angola' },
    { country: 'Anguilla' },
    { country: 'Antigua and Barbuda' },
    { country: 'Argentina' },
    { country: 'Armenia' },
    { country: 'Aruba' },
    { country: 'Australia' },
    { country: 'Austria' },
];

test('should return false', () => {
    expect(countryInclude(countries, 'Belarus')).toBe(false);
});

test('should return true', () => {
    expect(countryInclude(countries, 'Argentina')).toBe(true);
});

test('should return true', () => {
    expect(countryInclude(countries, 'Antigua and Barbuda')).toBe(true);
});

const duplicateCountries = [
    { country: 'Afghanistan' },
    { country: 'Albania' },
    { country: 'Algeria' },
    { country: 'Algeria' },
    { country: 'Andorra' },
    { country: 'Angola' },
    { country: 'Anguilla' },
    { country: 'Antigua and Barbuda' },
    { country: 'Argentina' },
    { country: 'Armenia' },
    { country: 'Armenia' },
    { country: 'Aruba' },
    { country: 'Australia' },
    { country: 'Australia' },
    { country: 'Austria' },
];

const duplicateCountriesResult = [
    { country: 'Afghanistan' },
    { country: 'Albania' },
    { country: 'Algeria' },
    { country: 'Andorra' },
    { country: 'Angola' },
    { country: 'Anguilla' },
    { country: 'Antigua and Barbuda' },
    { country: 'Argentina' },
    { country: 'Armenia' },
    { country: 'Aruba' },
    { country: 'Australia' },
    { country: 'Austria' },
];

test('should return not duplicate countries', () => {
    expect(removeDuplicateCountries(duplicateCountries)).toEqual(duplicateCountriesResult);
});

const sortDataArray = [
    { country: 'Albania', value: 28776 },
    { country: 'Aruba', value: 13318 },
    { country: 'Algeria', value: 19945 },
    { country: 'Andorra', value: 24183 },
    { country: 'Angola', value: 2525 },
    { country: 'Anguilla', value: 19256 },
    { country: 'Antigua and Barbuda', value: 17828 },
    { country: 'Argentina', value: 20525 },
    { country: 'Armenia', value: 13856 },
    { country: 'Afghanistan', value: 36804 },
    { country: 'Australia', value: 9810 },
    { country: 'Austria', value: 8513 },
];

const sortedDataByValue = [
    { country: 'Afghanistan', value: 36804 },
    { country: 'Albania', value: 28776 },
    { country: 'Andorra', value: 24183 },
    { country: 'Argentina', value: 20525 },
    { country: 'Algeria', value: 19945 },
    { country: 'Anguilla', value: 19256 },
    { country: 'Antigua and Barbuda', value: 17828 },
    { country: 'Armenia', value: 13856 },
    { country: 'Aruba', value: 13318 },
    { country: 'Australia', value: 9810 },
    { country: 'Austria', value: 8513 },
    { country: 'Angola', value: 2525 },
];

test('should return sortingByValue Array', () => {
    expect(sortData(sortDataArray, 'value')).toEqual(sortedDataByValue);
});
