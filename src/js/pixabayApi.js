import axios from 'axios';

export default class PixabayApiFetch {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.per_page = 40;
  }

  async fetchImages() {
    const BASE_URL = 'https://pixabay.com/api/';
    const KEY = '30833222-94e556fd2dbde651348f500b2';
    const searchParams = new URLSearchParams({
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
      per_page: '40',
    });
    try {
      const response = await axios.get(
        `${BASE_URL}?key=${KEY}&q=${this.searchQuery}&${searchParams}&page=${this.page}`
      );
      this.page += 1;
      return response;
    } catch (e) {
      console.log(e);
    }

    // return fetch(
    //   `${BASE_URL}?key=${KEY}&q=${this.searchQuery}&${searchParams}&page=${this.page}`
    // )
    //   .then(response => response.json())
    //   .then(data => {
    //     this.page += 1;
    //     console.log(data);
    //     return data;
    //   });
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
