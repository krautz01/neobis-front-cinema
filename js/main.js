const API_KEY = "e83d87cc-f996-4dc8-8476-aaaab4bd2c71";
const API_URL_PREMIERS =
  "https://kinopoiskapiunofficial.tech/api/v2.2/films/premieres?year=2024&month=JANUARY";

const API_URL_SEARCH =
  "https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=";

getMovies(API_URL_PREMIERS);

async function getMovies(url) {
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

function getClassByRate(vote) {
  if (vote >= 7) {
    return "green";
  } else if (vote > 5) {
    return "orange";
  } else {
    return "red";
  }
}

function showMovies(data) {
  const moviesEl = document.querySelector(".movie__cards");
  document.querySelector(".movie__cards").innerHTML = "";

  if (data.items) {
    data.items.forEach((movie) => {
      const movieEl = document.createElement("div");
      movieEl.classList.add("movie__card");
      movieEl.innerHTML = `
            <img src="${movie.posterUrlPreview}"
                alt="${movie.nameEn || movie.nameRu}"
                class="movie__img
            />
            <div class="movie__card__info">
              <div class="movie__title">${movie.nameEn || movie.nameRu}</div>
              <div class="movie__category">${movie.genres.map(
                (genre) => ` ${genre.genre}`
              )}</div>
            </div>`;
      moviesEl.appendChild(movieEl);
    });
  } else {
    data.films.forEach((movie) => {
      const movieEl = document.createElement("div");
      movieEl.classList.add("movie__card");
      movieEl.innerHTML = `
          <img src="${movie.posterUrlPreview}"
              alt="${movie.nameEn || movie.nameRu}"
              class="movie__img
          />
          <div class="movie__card__info">
            <div class="movie__title">${movie.nameEn || movie.nameRu}</div>
            <div class="movie__category">${movie.genres.map(
              (genre) => ` ${genre.genre}`
            )}</div>
            <div class="movie__average movie__average-${getClassByRate(movie.rating)}">${
              movie.rating
            }</div>
          </div>`;
      moviesEl.appendChild(movieEl);
    });
  }
}

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
