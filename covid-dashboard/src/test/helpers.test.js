import { countryInclude, removeDuplicateCountries } from '../common/helpers';

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
