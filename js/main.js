const API_KEY = "e83d87cc-f996-4dc8-8476-aaaab4bd2c71";
const API_URL_PREMIERS = `https://kinopoiskapiunofficial.tech/api/v2.2/films/premieres?year=${year}&month=${month}`;
const API_URL_SEARCH =
  "https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=";
const API_URL_RELEASES = `https://kinopoiskapiunofficial.tech/api/v2.1/films/releases?year=${year}&month=${month}`;
const API_URL_TOP_BESTS =
  "https://kinopoiskapiunofficial.tech/api/v2.2/films/collections?type=TOP_250_MOVIES";
const TOP_EXPECTED =
  "https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_AWAIT_FILMS";

getMovies(API_URL_PREMIERS);

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

// функция получения фильмов с сервера
async function getMovies(url) {
  try {
    const resp = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": API_KEY,
      },
    });
    const respData = await resp.json();
    console.log(respData);
    showMovies(respData);
  } catch (error) {
    console.error("Error fetching movies:", error);
  }
}

// функция определения класса для рейтинга
function getClassByRate(vote) {
  if (vote >= 7) {
    return "green";
  } else if (vote > 5) {
    return "orange";
  } else {
    return "red";
  }
}

// функция отображения фильмов
function showMovies(data) {
  const moviesEl = document.querySelector(".movie__cards");
  const favoriteMovies =
    JSON.parse(localStorage.getItem("favoriteMovies")) || [];
  const movies = data.items || data.films || data.releases || "No movies found";
  moviesEl.innerHTML = "";

  movies.forEach((movie) => {
    const isFavorite = favoriteMovies.some(
      (favoriteMovie) => favoriteMovie.kinopoiskId === favoriteMovie.kinopoiskId
    );
    const movieEl = document.createElement("div");
    movieEl.classList.add("movie__card");
    movieEl.setAttribute("id", movie.filmId || movie.kinopoiskId);
    movieEl.innerHTML = `
            <img src="${movie.posterUrlPreview}"
                alt="${movie.nameEn || movie.nameRu}"
                class="movie__img
            />
            <div class="movie__title">${movie.nameEn || movie.nameRu}</div>
            <div class="movie__category">${movie.genres.map(
              (genre) => ` ${genre.genre}`
            )}</div>
                ${
                  `<div
                    class="movie__average movie__average-${getClassByRate(
                      movie.rating
                    )}">
                ${movie.rating}
                    </div>` || ""
                }
                <div class="favorite-btn">
    <svg class="${
      isFavorite ? "favorite__heart-white" : "favorite__heart-red"
    }" id="${
      movie.filmId || movie.kinopoiskId
    }" width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M15.7 4C18.87 4 21 6.98 21 9.76C21 15.39 12.16 20 12 20C11.84 20 3 15.39 3 9.76C3 6.98 5.13 4 8.3 4C10.12 4 11.31 4.91 12 5.71C12.69 4.91 13.88 4 15.7 4Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
                </div>
            `;
    moviesEl.appendChild(movieEl);

    const favoriteButton = movieEl.querySelector(".favorite-btn");
    favoriteButton.addEventListener("click", (e) => {
      if (isFavorite) {
        removeFavorite(movie.filmId || movie.kinopoiskId);
      } else {
        toggleFavorite(movie);
      }
      showMovies(data);
    });
  });
}

// функция добавления в избранное
const toggleFavorite = (movie) => {
  const favoriteMovies =
    JSON.parse(localStorage.getItem("favoriteMovies")) || [];
  const movieIndex = favoriteMovies.findIndex(
    (favoriteMovie) =>
      favoriteMovie.kinopoiskId === movie.kinopoiskId ||
      favoriteMovie.filmId === movie.filmId
  );

  if (movieIndex === -1) {
    favoriteMovies.push(movie);
  } else {
    favoriteMovies.splice(movieIndex, 1);
  }

  localStorage.setItem("favoriteMovies", JSON.stringify(favoriteMovies));
  showMovies({ films: favoriteMovies });
  return favoriteMovies;
};

// функция удаления избранного
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

// функция показа избранного
const favoritesPageLink = document.getElementById("favorites");
favoritesPageLink.addEventListener("click", (event) => {
  event.preventDefault();
  const favoriteMovies =
    JSON.parse(localStorage.getItem("favoriteMovies")) || [];
  if (favoriteMovies.length > 0) {
    showMovies({ films: favoriteMovies });
  } else {
    alert("No favorite movies found");
  }
});

// функция поиска фильмов по названию
const form = document.querySelector("form");
const search = document.querySelector(".header__search");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const apiSearchUrl = `${API_URL_SEARCH}${search.value}`;
  console.log(apiSearchUrl);
  if (search.value) {
    getMovies(apiSearchUrl);
    search.value = "";
  } else {
    alert("Please enter a movie name");
  }
});

// обработчики событий для релизов
const releases = document.getElementById("releases");
releases.addEventListener("click", () => {
  getMovies(API_URL_RELEASES);
});

//обработчики событий для премьер
const premiers = document.getElementById("premiers");
premiers.addEventListener("click", () => {
  getMovies(API_URL_PREMIERS);
});

//обработчики событий для топ ожидаемых
const top_expected = document.getElementById("top_expected");
top_expected.addEventListener("click", () => {
  getMovies(TOP_EXPECTED);
});

//обработчики событий для топ лучших
const top_best = document.getElementById("top_best");
top_best.addEventListener("click", () => {
  getMovies(API_URL_TOP_BESTS);
});
