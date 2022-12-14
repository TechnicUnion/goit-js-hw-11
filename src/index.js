import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import PixabayApiFetch from './js/pixabayApi';
import imagesCard from './js/templates/markup.hbs';

const refs = {
  searchForm: document.querySelector('#search-form'),
  galleryContainer: document.querySelector('.gallery'),
  loadMoreButton: document.querySelector('.load-more'),
};

new SimpleLightbox('.photo-card a', {
  captionsData: 'alt',
  captionDelay: 250,
});

const pixabayApiFetch = new PixabayApiFetch();

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMoreButton.addEventListener('click', onLoadMore);

async function onSearch(evt) {
  evt.preventDefault();

  clearImagesMarcup();
  pixabayApiFetch.query = evt.currentTarget.elements.searchQuery.value.trim();
  if (!pixabayApiFetch.query) {
    failureNotify();
    return;
  }
  pixabayApiFetch.resetPage();
  const response = await pixabayApiFetch.fetchImages();
  if (response.data.hits.length === 0) {
    refs.loadMoreButton.classList.add('is-hidden');
    failureNotify();
    return;
  }

  appendImagesMarcup(response);
  successNotify(response);
  checkTotalPage(response);
}

async function onLoadMore() {
  const response = await pixabayApiFetch.fetchImages();
  appendImagesMarcup(response);
  checkTotalPage(response);
  cardsScroll();
}

// pixabayApiFetch.fetchImages().then(response => {
//   appendImagesMarcup(response);
//   checkTotalPage(response);
//   cardsScroll();
// });
// }

function appendImagesMarcup(response) {
  refs.galleryContainer.insertAdjacentHTML(
    'beforeend',
    imagesCard(response.data.hits)
  );
  onImageClick();
  refs.loadMoreButton.classList.remove('is-hidden');
}

function clearImagesMarcup() {
  refs.galleryContainer.innerHTML = '';
}

function checkTotalPage(response) {
  const totalPade = Math.ceil(
    response.data.totalHits / pixabayApiFetch.per_page
  );
  if (pixabayApiFetch.page > totalPade) {
    refs.loadMoreButton.classList.add('is-hidden');
    infoNotify();
  }
}

function onImageClick() {
  const lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
  });
}

function cardsScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

function successNotify(response) {
  Notify.success(`Hooray! We found ${response.data.totalHits} images.`);
}

function infoNotify() {
  Notify.info('We are sorry, but you have reached the end of search results.');
}

function failureNotify() {
  Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}
