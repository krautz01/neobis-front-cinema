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
  moviesEl.innerHTML = "";
  const favoriteMovies =
  JSON.parse(localStorage.getItem("favoriteMovies")) || [];
  const movies = data.items || data.films || data.releases || "No movies found";

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
                    )}"
                >
                ${movie.rating}
                </div>` || ""
                }
                <div class="favorite-btn">
                <button id="favoriteButton" class="${
                  isFavorite ? "favbtn-red" : "favbtn-green"
                }">addToFavorites</button>
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

///////////////////////////////////////////////////////////////
