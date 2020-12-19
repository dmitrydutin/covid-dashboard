const DIAGRAM_WORD_POPULATION = 7753933875;
const ACCESS_TOKEN = 'sk.eyJ1IjoiYXNiYXJuIiwiYSI6ImNraW16YjR6czAzeXoyeW95cHUya3djdTIifQ.nhucE6in6G6-Np4PI-CyFA';
const CRITERIONS = [
    {
        name: 'Total number of cases',
        value: 'cases',
        color: '#BC0000',
    },
    {
        name: 'Total number of deaths',
        value: 'deaths',
        color: '#ffff0a',
    },
    {
        name: 'Total number of recoveries',
        value: 'recovered',
        color: '#00bc00',
    },
    {
        name: 'Number of cases in the last day',
        value: 'todayCases',
        color: '#880000',
    },
    {
        name: 'Number of deaths in the last day',
        value: 'todayDeaths',
        color: '#B5B800',
    },
    {
        name: 'Number of recoveries in the last day',
        value: 'todayRecovered',
        color: '#0042E5',
    },
    {
        name: 'Number of cases per 100 thousand population',
        value: 'casesPer100K',
        color: '#4B0000',
    },
    {
        name: 'Number of deaths per 100 thousand population',
        value: 'deathsPer100K',
        color: '#727317',
    },
    {
        name: 'Number of recoveries per 100 thousand population',
        value: 'recoveredPer100K',
        color: '#002582',
    },
    {
        name: 'Number of cases per 100 thousand population in the last day',
        value: 'todayCasesPer100K',
        color: '#EE5A5A',
    },
    {
        name: 'Number of deaths per 100 thousand population in the last day',
        value: 'todayDeathsPer100K',
        color: '#727317',
    },
    {
        name: 'Number of recoveries per 100 thousand population in the last day',
        value: 'todayRecoveredPer100K',
        color: '#15153D',
    }];

export { ACCESS_TOKEN, DIAGRAM_WORD_POPULATION, CRITERIONS };
