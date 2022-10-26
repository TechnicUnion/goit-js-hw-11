import './css/styles.css';
import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import PixabayApiFetch from './js/pixabayApi';
import imagesCard from './js/templates/markup.hbs';

const refs = {
  searchForm: document.querySelector('#search-form'),
  galleryContainer: document.querySelector('.gallery'),
  loadMoreButton: document.querySelector('.load-more'),
};

const pixabayApiFetch = new PixabayApiFetch();

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMoreButton.addEventListener('click', onLoadMore);

function onSearch(evt) {
  evt.preventDefault();

  clearImagesMarcup();
  pixabayApiFetch.query = evt.currentTarget.elements.searchQuery.value.trim();
  if (!pixabayApiFetch.query) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }
  pixabayApiFetch.resetPage();
  pixabayApiFetch.fetchImages().then(data => {
    appendImagesMarcup(data);
  });
}

function onLoadMore() {
  pixabayApiFetch.fetchImages().then(data => {
    appendImagesMarcup(data);
    checkTotalPage(data);
  });
}

function appendImagesMarcup(data) {
  if (data.hits.length === 0) {
    refs.loadMoreButton.classList.add('is-hidden');
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }

  refs.galleryContainer.insertAdjacentHTML('beforeend', imagesCard(data.hits));
  refs.loadMoreButton.classList.remove('is-hidden');
}

function clearImagesMarcup() {
  refs.galleryContainer.innerHTML = '';
}

function checkTotalPage(data) {
  const totalPade = Math.ceil(data.totalHits / pixabayApiFetch.per_page);

  if (pixabayApiFetch.page > totalPade) {
    refs.loadMoreButton.classList.add('is-hidden');
    Notify.info(
      'We are sorry, but you have reached the end of search results.'
    );
  }
}
