const API_KEY = "e83d87cc-f996-4dc8-8476-aaaab4bd2c71";
const API_URL_PREMIERS =
  "https://kinopoiskapiunofficial.tech/api/v2.2/films/premieres?year=2024&month=JANUARY";

getMovies(API_URL_PREMIERS);

async function getMovies(url) {
  const resp = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": API_KEY,
    },
  });
  const respData = await resp.json();
  showMovies(respData);
}

function showMovies(data) {
  const moviesEl = document.querySelector(".movie__cards");
  data.items.forEach((movie) => {
    const movieEl = document.createElement("div");
    movieEl.classList.add("movie__card");
    movieEl.innerHTML = `
        <img src="${movie.posterUrlPreview}"
            alt="${movie.nameRu}"
            class="movie__img
        />
        <div class="movie__card__info">
          <div class="movie__title">${movie.nameRu}</div>
          <div class="movie__category">${movie.genres.map(
            (genre) => `${genre.genre}`
          )}</div>
          <div class="movie__average movie__average-green">9</div>
        </div>`;
    moviesEl.appendChild(movieEl);
  });
}
