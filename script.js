const allShows = getAllShows();
const rootElem = document.getElementById("root");
const selectShowEl = document.getElementById("select-show");
const selectEpisodeEl = document.getElementById("select-episode");
const searchElm = document.getElementById("search");

let currentShow;
let currentShowEpisodes = [];
let isDisplayingEpisodes = false;
let episodes_api_url = `https://api.tvmaze.com/shows/[SHOW-ID]/episodes`;

function setup() {
  displayAllShows(allShows);
}

function makePageForEpisodes(episodes) {
  episodes.forEach((episode) => {
    createEpisodeCode(episode);
    createEpisodeCard(episode);
  });
  displayNumber(episodes, episodes, "Episodes");
}

function createEpisodeCode(episode) {
  episode.se = `S${String(episode.season).padStart(2, 0)}E${String(
    episode.number
  ).padStart(2, 0)}`;
}

function createEpisodeCard(episode) {
  // Create episode container div
  const episodeContainerEl = document.createElement("div");
  rootElem.appendChild(episodeContainerEl);
  episodeContainerEl.className = "episode-container";

  // Create episode title container div
  const titleContainerEl = document.createElement("div");
  episodeContainerEl.appendChild(titleContainerEl);
  titleContainerEl.className = "title-container";

  // Create episode code element (SxxExx) format
  const seasonAndEpisodeNumEl = document.createElement("p");
  titleContainerEl.appendChild(seasonAndEpisodeNumEl);
  seasonAndEpisodeNumEl.className = "season-episode-num";
  seasonAndEpisodeNumEl.textContent = episode.se;

  // Create episode name element
  const nameEl = document.createElement("h4");
  titleContainerEl.appendChild(nameEl);
  nameEl.className = "name";
  nameEl.textContent = episode.name;

  // Create episode image element
  const imgEl = document.createElement("img");
  episodeContainerEl.appendChild(imgEl);
  imgEl.className = "episode-image";
  imgEl.src =
    episode.image !== null ? episode.image.medium.replace("http", "https") : "";

  // Create episode summary element
  const summaryEl = document.createElement("p");
  episodeContainerEl.appendChild(summaryEl);
  summaryEl.className = "summary";
  summaryEl.innerHTML =
    episode.summary !== null ? episode.summary : "No Summary Available";
  // .replace("<p>", "")
  // .replace("</p>", "");
}

function displayNumber(array1, array2, type) {
  document.querySelector(
    ".display"
  ).textContent = `Displaying:${array1.length}/${array2.length} ${type}`;
}

function emptyRootElement() {
  document.getElementById("root").innerHTML = "";
}

// Searching
searchElm.addEventListener("input", () => {
  displayMatchingSearchResults(searchElm.value);
  // highlightSearchTerm(e);
});

function displayMatchingSearchResults(searchInput) {
  emptyRootElement();
  let filteredSearch;

  if (isDisplayingEpisodes) {
    filteredSearch = filterSearchedInEpisodes(currentShowEpisodes, searchInput);
    makePageForEpisodes(filteredSearch);
    displayNumber(filteredSearch, currentShowEpisodes, "Episodes");
  } else {
    filteredSearch = filterSearchedInShows(allShows, searchInput);
    displayAllShows(filteredSearch);
    displayNumber(filteredSearch, allShows, "Shows");
  }

  return filteredSearch;

  // HIGHLIGHTING ATTEMPT:
  // const searchTerm = searchElm.value;
  // if (filteredEpisodes.includes(searchTerm)) {
  //   searchTerm.style.color = "red";
  // }
}

function filterSearchedInEpisodes(episodes, searchInput) {
  const filteredEpisodes = episodes.filter(
    (episode) =>
      episode.se.toUpperCase().includes(searchInput.toUpperCase()) ||
      episode.name.toUpperCase().includes(searchInput.toUpperCase()) ||
      (episode.summary !== null &&
        episode.summary.toUpperCase().includes(searchInput.toUpperCase()))
  );
  return filteredEpisodes;
}

function filterSearchedInShows(shows, searchInput) {
  const filteredShows = shows.filter(
    (show) =>
      show.name.toUpperCase().includes(searchInput.toUpperCase()) ||
      show.summary.toUpperCase().includes(searchInput.toUpperCase()) ||
      separateGenres(show.genres)
        .toUpperCase()
        .includes(searchInput.toUpperCase())
  );
  return filteredShows;
}

// function highlightSearchTerm(searchTerm) {
//   searchTerm.style.backgroundColor = "red";
// }

// Adding shows to drop down menu
function addAllShowsToSelectionMenu(shows) {
  const allShowsOption = document.createElement("option");
  selectShowEl.appendChild(allShowsOption);
  allShowsOption.textContent = "=== All Shows ===";
  allShowsOption.className = "show-option";

  shows
    .sort((showA, showB) =>
      showA.name.toUpperCase() > showB.name.toUpperCase() ? 1 : -1
    )
    .forEach((show) => {
      const showOption = document.createElement("option");
      selectShowEl.appendChild(showOption);
      showOption.textContent = show.name;
      showOption.className = "show-option";
      // showOption.value = show.id;
    });
}

// Adding show episodes to drop down menu
function addAllEpisodesToSelectionMenu(episodes) {
  const allEpisodesOption = document.createElement("option");
  selectEpisodeEl.appendChild(allEpisodesOption);
  allEpisodesOption.textContent = "=== All Episodes ===";
  allEpisodesOption.className = "episode-option";

  episodes.forEach((episode) => {
    const episodeOption = document.createElement("option");
    selectEpisodeEl.appendChild(episodeOption);
    episodeOption.textContent = `${episode.se} - ${episode.name}`;
    episodeOption.className = "episode-option";
  });
}

// Selecting Episodes
selectEpisodeEl.addEventListener("change", () => {
  moveToEpisode(currentShowEpisodes);
});

function moveToEpisode(episodes) {
  emptyRootElement();
  const selectedEpisode = selectEpisodeEl.value;

  if (selectedEpisode === "=== All Episodes ===") {
    makePageForEpisodes(episodes);
  } else {
    const selectedEp = episodes.filter((episode) =>
      selectedEpisode.includes(episode.se)
    );
    makePageForEpisodes(selectedEp);
    displayNumber(selectedEp, episodes, "Episodes");
  }
}
// Selecting shows
selectShowEl.addEventListener("change", () => {
  moveToShow(allShows);
});

function moveToShow(shows) {
  emptyRootElement();
  document.getElementById("select-episode").innerHTML = "";

  const selectedShow = selectShowEl.value;

  if (selectedShow === "=== All Shows ===") {
    displayAllShows(allShows);
    isDisplayingEpisodes = false;
  } else {
    currentShow = shows.find((show) => show.name === selectedShow);
    getShowEpisodes(currentShow.id);
    isDisplayingEpisodes = true;
  }
}

// Fetching show episodes API
function getShowEpisodes(showID) {
  let selectedApiUrl = episodes_api_url.replace("[SHOW-ID]", String(showID));
  fetch(selectedApiUrl)
    .then((response) => response.json())
    .then((data) => {
      currentShowEpisodes = data;
      makePageForEpisodes(currentShowEpisodes);
      addAllEpisodesToSelectionMenu(currentShowEpisodes);
    })
    .catch((error) => console.log(error));
}

function separateGenres(genres) {
  let allGenres = "";
  genres.forEach((genre) =>
    genre === genres[0]
      ? (allGenres += `${genre}`)
      : (allGenres += ` | ${genre}`)
  );
  return allGenres;
}

function createShowCard(show) {
  const separatedGenres = separateGenres(show.genres);
  rootElem.innerHTML += `
    <div class="show-card-container">
      <h2>${show.name}</h2>
      <div class="show-card-body">
        <img class ="show-img" src="${show.image.medium}" />
        <p class="show-summary">${show.summary}</p>
        <div class="show-info">
          <p class="rating">Rating: ${String(show.rating.average)}</p>
          <p class="genres">Genres: ${separatedGenres}</p>
          <p class="status">Status: ${show.status}</p>
          <p class="runtime">Runtime: ${show.runtime}</p> 
        </div>
      </div>
    </div>
  `;
}

function displayAllShows(shows) {
  addAllShowsToSelectionMenu(shows);
  emptyRootElement();
  shows.forEach((show) => {
    createShowCard(show);
  });
  // displayNumber(shows, shows, "Shows");
}

window.onload = setup;

// HTML template for creating episode card (Not used because some corrupted images in some shows caused errors)

// rootElem.innerHTML += `
// <div class="episode-container">
//   <div class="title-container">
//     <p class="season-episode-num">${episode.se}</p>
//     <h3 class="name">${episode.name}</h3>
//   </div>
//   <img src="${episode.image.medium.replace("http", "https")}" />
//   <p class="summary">${episode.summary}</p>
// </div>
// `;
