import { Notify } from 'notiflix';

const BASE_URL = 'https://restcountries.com/v3.1/name';

const searchParams = `fields=name,capital,population,languages,flags`;

export function fetchCountries(name) {
    return fetch(`${BASE_URL}/${name}?${searchParams}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error(response.status);
            }
            return response.json();
        })
        .then(countries => countries);

}