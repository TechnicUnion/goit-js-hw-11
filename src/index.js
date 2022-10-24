import './css/styles.css';
import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import PixabayApiFetch from './js/pixabayApi';

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

  pixabayApiFetch.query = evt.currentTarget.elements.searchQuery.value;
  pixabayApiFetch.resetPage();
  pixabayApiFetch.fetchImages();
}

function onLoadMore() {
  pixabayApiFetch.fetchImages();
}
