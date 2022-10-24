import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './js/fetchCountries';

const DEBOUNCE_DELAY = 300;

const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');
const inputEl = document.querySelector('#search-box');

inputEl.setAttribute('placeholder', 'Enter the country');
inputEl.addEventListener('input', debounce(onInputCountry, DEBOUNCE_DELAY));

function onInputCountry(evt) {
  const country = evt.target.value.trim();

  countryList.innerHTML = '';
  countryInfo.innerHTML = '';

  if (!country) {
    inputEl.removeEventListener(
      'input',
      debounce(onInputCountry, DEBOUNCE_DELAY)
    );
    return;
  }

  fetchCountries(country)
    .then(data => {
      if (data.length === 1) {
        countryInfo.innerHTML = creatMarckup(data);
      } else if (data.length > 1 && data.length <= 10) {
        countryList.innerHTML = creatCountryList(data);
      } else {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      }
    })
    .catch(err => {
      countryInfo.innerHTML = '';
      countryList.innerHTML = '';
      Notify.failure('Oops, there is no country with that name');
    });
}

function creatMarckup(arr) {
  return arr
    .map(
      country =>
        `<h2><img src=${country.flags.svg} alt=${country.name.official} />${
          country.name.official
        }</h2>
<h3>Capital: ${country.capital}</h3>
<h3>Population: ${country.population}</h3>
<h3>Languages: ${Object.values(country.languages).join(', ')}</h3>`
    )
    .join('');
}

function creatCountryList(arr) {
  return arr
    .map(
      country =>
        `<li><img src=${country.flags.svg} alt=${country.name.official} />${country.name.official}</li>`
    )
    .join('');
}
