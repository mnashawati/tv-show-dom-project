const allShows = getAllShows();
const rootElem = document.getElementById("root");
const selectShowEl = document.getElementById("select-show");
const selectEpisodeEl = document.getElementById("select-episode");
const searchElm = document.getElementById("search");

let currentShow;
let currentShowEpisodes = [];
let isDisplayingEpisodes = false;
let episodes_api_url = `https://api.tvmaze.com/shows/[SHOW-ID]/episodes`;

function hideEpisodeSelectionMenu() {
  selectEpisodeEl.style.display = "none";
  isDisplayingEpisodes = false;
}

function showEpisodeSelectionMenu() {
  selectEpisodeEl.style.display = "initial";
  isDisplayingEpisodes = true;
}

function setup() {
  addAllShowsToSelectionMenu(allShows);
  displayAllShows(allShows);
  hideEpisodeSelectionMenu();
}

function makePageForEpisodes(episodes) {
  emptyRootElement();
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

// Adding show episodes to drop down menu
function addAllEpisodesToSelectionMenu(episodes) {
  const allEpisodesOption = document.createElement("option");
  selectEpisodeEl.appendChild(allEpisodesOption);
  allEpisodesOption.textContent = "*** ALL EPISODES ***";
  allEpisodesOption.className = "episode-option";
  allEpisodesOption.id = "ALL EPISODES";

  episodes.forEach((episode) => {
    const episodeOption = document.createElement("option");
    selectEpisodeEl.appendChild(episodeOption);
    episodeOption.textContent = `${episode.se} - ${episode.name}`;
    episodeOption.className = "episode-option";
    episodeOption.id = episode.id;
  });
}

// Selecting Episodes
selectEpisodeEl.addEventListener("change", () => {
  moveToEpisode(currentShowEpisodes);
});

function moveToEpisode(episodes) {
  emptyRootElement();
  const selectedOptionID =
    selectEpisodeEl.options[selectEpisodeEl.selectedIndex].id;

  if (selectedOptionID === "ALL EPISODES") {
    makePageForEpisodes(episodes);
  } else {
    const selectedEp = episodes.filter(
      (episode) => String(episode.id) === selectedOptionID
    );
    makePageForEpisodes(selectedEp);
    displayNumber(selectedEp, episodes, "Episodes");
  }
}

// Adding shows to drop down menu
function addAllShowsToSelectionMenu(shows) {
  const allShowsOption = document.createElement("option");
  selectShowEl.appendChild(allShowsOption);
  allShowsOption.textContent = "*** ALL SHOWS ***";
  allShowsOption.className = "show-option";
  allShowsOption.id = "ALL SHOWS";

  shows
    .sort((showA, showB) =>
      showA.name.toUpperCase() > showB.name.toUpperCase() ? 1 : -1
    )
    .forEach((show) => {
      const showOption = document.createElement("option");
      selectShowEl.appendChild(showOption);
      showOption.textContent = show.name;
      showOption.className = "show-option";
      showOption.id = show.id;
    });
}

// Selecting shows
selectShowEl.addEventListener("change", () => {
  moveToShow(allShows);
});

function moveToShow(shows) {
  emptyRootElement();
  document.getElementById("select-episode").innerHTML = "";

  const selectedShowID = selectShowEl.options[selectShowEl.selectedIndex].id;

  if (selectedShowID === "ALL SHOWS") {
    displayAllShows(allShows);
    hideEpisodeSelectionMenu();
  } else {
    currentShow = shows.find((show) => String(show.id) === selectedShowID);
    getShowEpisodes(currentShow.id);
    showEpisodeSelectionMenu();
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

  const showCardContainerEl = document.createElement("div");
  rootElem.appendChild(showCardContainerEl);
  showCardContainerEl.className = "show-card-container";

  const showNameEl = document.createElement("div");
  showCardContainerEl.appendChild(showNameEl);
  showNameEl.className = "show-name-container";

  const showNameLink = document.createElement("h3");
  showNameEl.appendChild(showNameLink);
  showNameLink.className = "show-name-link";
  showNameLink.textContent = show.name;
  showNameLink.addEventListener("click", () => {
    selectShowEl.value = showNameLink.innerText;
    moveToShow(allShows, showNameLink.innerText);
  });

  const showCardBodyEl = document.createElement("div");
  showCardContainerEl.appendChild(showCardBodyEl);
  showCardBodyEl.className = "show-card-body";

  const showImgEl = document.createElement("img");
  showCardBodyEl.appendChild(showImgEl);
  showImgEl.className = "show-img";
  showImgEl.src = show.image.medium;

  const showSummaryEl = document.createElement("p");
  showCardBodyEl.appendChild(showSummaryEl);
  showSummaryEl.className = "show-summary";
  showSummaryEl.innerHTML = show.summary;

  const showInfoEl = document.createElement("div");
  showCardBodyEl.appendChild(showInfoEl);
  showInfoEl.className = "show-info";

  const showRatingEl = document.createElement("p");
  showInfoEl.appendChild(showRatingEl);
  showRatingEl.className = "show-rating";
  showRatingEl.innerHTML = `Rating: ${String(show.rating.average)}`;

  const showGenresEl = document.createElement("p");
  showInfoEl.appendChild(showGenresEl);
  showGenresEl.className = "show-genres";
  showGenresEl.textContent = `Genres: ${separatedGenres}`;

  const showStatusEl = document.createElement("p");
  showInfoEl.appendChild(showStatusEl);
  showStatusEl.className = "show-status";
  showStatusEl.textContent = `Status: ${show.status}`;

  const showRuntimeEl = document.createElement("p");
  showInfoEl.appendChild(showRuntimeEl);
  showRuntimeEl.className = "show-runtime";
  showRuntimeEl.textContent = `Runtime: ${show.runtime}`;
}

function displayAllShows(shows) {
  emptyRootElement();
  shows.forEach((show) => {
    createShowCard(show);
  });
  displayNumber(allShows, allShows, "Shows");
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

// function createShowCardTemplate(show) {
//   const separatedGenres = separateGenres(show.genres);
//   rootElem.innerHTML += `
//     <div class="show-card-container">
//       <button type="button" class="show-name">${show.name}</button>
//       <div class="show-card-body">
//         <img class ="show-img" src="${show.image.medium}" />
//         <p class="show-summary">${show.summary}</p>
//         <div class="show-info">
//           <p class="rating">Rating: ${String(show.rating.average)}</p>
//           <p class="genres">Genres: ${separatedGenres}</p>
//           <p class="status">Status: ${show.status}</p>
//           <p class="runtime">Runtime: ${show.runtime}</p>
//         </div>
//       </div>
//     </div>
//   `;
// }
