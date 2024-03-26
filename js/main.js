const API_KEY = "e83d87cc-f996-4dc8-8476-aaaab4bd2c71";
const API_URL_PREMIERS =
  "https://kinopoiskapiunofficial.tech/api/v2.2/films/premieres?year=2024&month=JANUARY";
const API_URL_SEARCH =
  "https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=";
const API_URL_RELEASES =
  "https://kinopoiskapiunofficial.tech/api/v2.1/films/releases?year=2024&month=JANUARY";
const API_URL_TOP_BESTS =
  "https://kinopoiskapiunofficial.tech/api/v2.2/films/collections?type=TOP_250_MOVIES";
const TOP_EXPECTED =
  "https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_AWAIT_FILMS";

getMovies(API_URL_PREMIERS);

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

  function displayHTML(movies) {
    movies.forEach((movie) => {
      const movieEl = document.createElement("div");
      movieEl.classList.add("movie__card");
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
                  )}"
                >
                  ${movie.rating}
                </div>` || ""
              }
              <img src="./images/favorite_heart.svg" alt="favorite" class="material-symbols-outlined"/>
            
            `;
      moviesEl.appendChild(movieEl);
    });
  }

  if (data.items) {
    displayHTML(data.items);
  } else if (data.films) {
    displayHTML(data.films);
  } else if (data.releases) {
    displayHTML(data.releases);
  } else {
    alert("No movies found");
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

const releases = document.getElementById("releases");
releases.addEventListener("click", () => {
  getMovies(API_URL_RELEASES);
});

const premiers = document.getElementById("premiers");
premiers.addEventListener("click", () => {
  getMovies(API_URL_PREMIERS);
});

const top_expected = document.getElementById("top_expected");
top_expected.addEventListener("click", () => {
  getMovies(TOP_EXPECTED);
});

const top_best = document.getElementById("top_best");
top_best.addEventListener("click", () => {
  getMovies(API_URL_TOP_BESTS);
});

const favorites = document.getElementById("favorites");
