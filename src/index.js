import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix';
import { fetchCountries } from './components/fetchCountries';

const DEBOUNCE_DELAY = 300;

const refs = {
    inputField: document.querySelector('#search-box'),
    countryList: document.querySelector('.country-list'),
    countryInfo: document.querySelector('.country-info'),
}

const notifyOptions = {
    showOnlyTheLastOne: true,
    fontSize: '13pt',
    cssAnimationDuration: 200,
};

refs.inputField.addEventListener('input', debounce(onFieldInput, DEBOUNCE_DELAY));

function onFieldInput(e) {
    const name = e.target.value.trim();
    console.log(name);

    if (name === '') {
        clearAll();
        return;
    }

    fetchCountries(name)
        .then((countries) => {
            clearAll();

            if (countries.length === 1) {
                const markup = createCoutryInfoMarkup(countries);
                appendMarkup(refs.countryInfo, markup);
                return;
            }

            if (countries.length > 1 && countries.length <= 10) {
                const markup = createCoutryListMarkup(countries);
                appendMarkup(refs.countryList, markup);
                return;
            }

            Notify.info('Too many matches found. Please enter a more specific name.', notifyOptions);
        })
        .catch(catchError);
}

function clearAll() {
    refs.countryList.innerHTML = '';
    refs.countryInfo.innerHTML = '';
}

function catchError() {
    Notify.failure('Oops, there is no country with that name', notifyOptions);
    clearAll();
}

function appendMarkup(ref, markup) {
    ref.insertAdjacentHTML('beforeend', markup)
}

function createCoutryListMarkup(countries) {
    return countries.map(({ name, flags }) => {
        return `
        <li class="country-list__item">
            <span class="country-list__image-container">
                <img src="${flags.svg}" alt="${name.common}" class="country-list__image" />
            </span>
            <p class="country-list__name">${name.common}</p>
        </li>
        `;
    }).join('');
}

function createCoutryInfoMarkup(countries) {
    const { name, flags, capital, population, languages } = countries[0];
    const countryLanguages = Object.values(languages).join(', ');

    return `
    <div class="counry-info__header">
        <span class="counry-info__image-container">
          <img src="${flags.svg}" alt="${name.common}" class="counry-info__image" />
        </span>
        <p class="counry-info__name">${name.common}</p>
      </div>
      <ul class="country-info__list">
        <li class="country-info__item">
          <span class="country-info__title">Capital:</span>
          ${capital}
        </li>
        <li class="country-info__item">
          <span class="country-info__title">Population:</span>
          ${population}
        </li>
        <li class="country-info__item">
          <span class="country-info__title">Languages:</span>
          ${countryLanguages}
        </li>
      </ul>
    `;
}
