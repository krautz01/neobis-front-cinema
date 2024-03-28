const infoDate = new Date();
const monthOfYear = [
  "JANUARY",
  "FEBRUARY",
  "MARCH",
  "APRIL",
  "MAY",
  "JUNE",
  "JULY",
  "AUGUST",
  "SEPTEMBER",
  "OCTOBER",
  "NOVEMBER",
  "DECEMBER",
];
const month = monthOfYear[infoDate.getMonth()];
const year = infoDate.getFullYear();

// Топ лучшиe
const API_KEY = "8c8e1a50-6322-4135-8875-5d40a5420d86";
const apiUrl =
  "https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_100_POPULAR_FILMS&page=1";
// поиск
const apiSearchUrl =
  "https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=";
// Премьеры месяца
const API_URL_PREMIERES = `https://kinopoiskapiunofficial.tech/api/v2.2/films/premieres?year=${year}&month=${month}`;
// Топ ожидаемых
const API_URL_ANTICIPATED =
  "https://kinopoiskapiunofficial.tech/api/v2.2/films/collections?type=CLOSES_RELEASES&page=1";
// Pелизы месяца
const API_URL_RELEASES = `https://kinopoiskapiunofficial.tech/api/v2.1/films/releases?year=${year}&month=${month}`;

const premiereMoviesBtn = document.getElementById("premiereMovies");
const anticipatedMoviesBtn = document.getElementById("anticipatedMovies");
const topMovieBtn = document.getElementById("topMovie");
const realesesMonthMoviesBtn = document.getElementById("realesesMonthMovies");
const favoriteMoviesBtn = document.getElementById("favoriteMovies");

getMovie(apiUrl);

async function getMovie(url) {
  const resp = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": API_KEY,
    },
  });
  const respData = await resp.json();
  console.log(respData);
  showMovies(respData);
}

function showMovies(data) {
  const moviesEl = document.querySelector(".movies");
  moviesEl.innerHTML = ""; // Очищаем предыдущие фильмы
  const favoriteMovies =
    JSON.parse(localStorage.getItem("favoriteMovies")) || [];
  const films = data.releases || data.films || data.items;

  films.forEach((movie) => {
    const isFavorite = favoriteMovies.some(
      (favMovie) => favMovie.kinopoiskId === movie.kinopoiskId
    );
    const movieEl = document.createElement("div");
    movieEl.classList.add("movie-card");
    movieEl.innerHTML = `
        <div class="movie-card-inner">
        <img src="${movie.posterUrlPreview}" alt="${
      movie.nameRu
    }" class="movie-card__img">
        <div class="movie-card-darkened"></div>
    </div>
    <div class="movie__info">
        <p class="movie__title">${movie.nameRu}</p>
        <p class="movie__category">${movie.genres.map(
          (genre) => genre.genre
        )}</p>
        <div class="movie__average movie__average__green">9</div>
        <div class="icon">

        <img  
        data-kinopoisk-id="${movie.kinopoiskId}" 
        src="${isFavorite ? "img/heart-red.png" : "img/heart.jpg"}"
        class="favorite-btn">
        
        </div>
    </div>  `;
    const favoriteBtn = movieEl.querySelector(".favorite-btn");

    favoriteBtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (isFavorite) {
        removeFavorite(movie.kinopoiskId);
      } else {
        toggleFavorite(movie);
      }
      showMovies(data);
    });

    moviesEl.appendChild(movieEl);
  });
  console.log(data.films);
}

function toggleFavorite(movie) {
  const favoriteMovies =
    JSON.parse(localStorage.getItem("favoriteMovies")) || [];
  const movieIndex = favoriteMovies.findIndex(
    (favMovie) => favMovie.kinopoiskId === movie.kinopoiskId
  );

  if (movieIndex === -1) {
    favoriteMovies.push(movie);
  } else {
    favoriteMovies.splice(movieIndex, 1);
  }

  localStorage.setItem("favoriteMovies", JSON.stringify(favoriteMovies));

  showMovies({ films: favoriteMovies });

  return favoriteMovies;
}

function removeFavorite(kinopoiskId) {
  const favoriteMovies =
    JSON.parse(localStorage.getItem("favoriteMovies")) || [];
  const updatedFavorites = favoriteMovies.filter(
    (movie) => movie.kinopoiskId !== kinopoiskId
  );
  localStorage.setItem("favoriteMovies", JSON.stringify(updatedFavorites));
  showMovies({ items: updatedFavorites });

  return updatedFavorites;
}

// Премьеры месяца
premiereMoviesBtn.addEventListener("click", (e) => {
  e.preventDefault();
  getMovie(API_URL_PREMIERES);
});
// Топ ожидаемых
anticipatedMoviesBtn.addEventListener("click", (e) => {
  e.preventDefault();
  getMovie(API_URL_ANTICIPATED);
});

// Топ лучшиe
topMovieBtn.addEventListener("click", (e) => {
  e.preventDefault();
  getMovie(apiUrl);
});
// Pелизы месяца
realesesMonthMoviesBtn.addEventListener("click", (e) => {
  e.preventDefault();
  getMovie(API_URL_RELEASES);
});
// Избранные
favoriteMoviesBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const favoriteMovies =
    JSON.parse(localStorage.getItem("favoriteMovies")) || [];

  if (favoriteMovies.length > 0) {
    showMovies({ films: favoriteMovies });
  } else {
    console.log("No favorite movies.");
  }
});

const form = document.querySelector(".header__form");
const search = document.querySelector(".form__input");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const apiSearch = `${apiSearchUrl}${search.value}`;
  if (search.value) {
    getMovie(apiSearch);
    search.value = "";
  }
});
