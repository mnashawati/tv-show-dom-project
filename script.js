const allShows = getAllShows();
const rootElem = document.getElementById("root");
const rowEl = document.getElementById("row");

const selectShowEl = document.getElementById("select-show");
const selectEpisodeEl = document.getElementById("select-episode");
const searchEl = document.getElementById("search");

let currentShow;
let currentShowEpisodes = [];
let isDisplayingEpisodes = false;
let episodes_api_url = `https://api.tvmaze.com/shows/[SHOW-ID]/episodes`;

function setup() {
  addAllShowsToSelectionMenu(allShows);
  displayAllShows(allShows);
  hideEpisodeSelectionMenu();
}

// Adding shows to drop down show selection menu
function addAllShowsToSelectionMenu(shows) {
  const allShowsOption = document.createElement("option");
  selectShowEl.appendChild(allShowsOption);
  allShowsOption.innerText = "*** ALL SHOWS ***";
  allShowsOption.className = "show-option";
  allShowsOption.value = "ALL SHOWS";

  shows
    .sort((showA, showB) =>
      showA.name.toUpperCase() > showB.name.toUpperCase() ? 1 : -1
    )
    .forEach((show) => {
      const showOption = document.createElement("option");
      selectShowEl.appendChild(showOption);
      showOption.innerText = show.name;
      showOption.className = "show-option";
      showOption.value = show.id;
    });

  // Selecting shows
  selectShowEl.addEventListener("change", () => {
    moveToShow(allShows);
  });
}

function displayAllShows(shows) {
  emptyRowEl();
  shows.forEach((show) => {
    createShowCard(show);
  });
  displayNumber(allShows, allShows, "Shows");
}

function emptyRowEl() {
  rowEl.innerHTML = "";
}

function createShowCard(show) {
  const showCardContainerEl = document.createElement("div");
  rowEl.appendChild(showCardContainerEl);
  showCardContainerEl.className =
    "show-card-container sm-col-6 md-col-5 lg-col-4 xl-col-3";

  const showCardBodyEl = document.createElement("div");
  showCardContainerEl.appendChild(showCardBodyEl);
  showCardBodyEl.className = "show-card-body";

  const showImgEl = document.createElement("img");
  showCardBodyEl.appendChild(showImgEl);
  showImgEl.className = "show-img";
  showImgEl.src = show.image.medium.replace("http", "https");

  showImgEl.addEventListener("click", () => {
    selectShowEl.value = show.id;
    moveToShow(allShows);
  });

  const showNameEl = document.createElement("h3");
  showCardBodyEl.appendChild(showNameEl);
  showNameEl.className = "show-name";
  showNameEl.innerText = show.name;

  const showInfoEl = document.createElement("div");
  showCardBodyEl.appendChild(showInfoEl);
  showInfoEl.className = "show-info";

  const showStatusEl = document.createElement("p");
  showInfoEl.appendChild(showStatusEl);
  showStatusEl.className = "show-status";
  showStatusEl.innerText = `${show.status}`;

  const showRatingEl = document.createElement("i");
  showInfoEl.appendChild(showRatingEl);
  showRatingEl.className = "fas fa-star show-rating";
  showRatingEl.innerText = `${String(show.rating.average)}`;

  const showRuntimeEl = document.createElement("p");
  showInfoEl.appendChild(showRuntimeEl);
  showRuntimeEl.className = "show-runtime";
  showRuntimeEl.innerText = `Runtime: ${show.runtime}`;
}

function displayNumber(array1, array2, type) {
  document.querySelector(
    ".display"
  ).textContent = `Displaying:${array1.length}/${array2.length} ${type}`;
}

function hideEpisodeSelectionMenu() {
  selectEpisodeEl.style.display = "none";
  isDisplayingEpisodes = false;
  searchEl.placeholder = "Search Shows...";
}

function showEpisodeSelectionMenu() {
  selectEpisodeEl.style.display = "initial";
  isDisplayingEpisodes = true;
  searchEl.placeholder = "Search Episodes...";
}

function emptyEpisodeSelectionMenu() {
  selectEpisodeEl.innerHTML = "";
}

function moveToShow(shows) {
  const currentShowCardEl = document.getElementById("current-show-card");
  if (currentShowCardEl != null) {
    currentShowCardEl.remove();
  }

  emptyRowEl();
  emptyEpisodeSelectionMenu();

  const selectedShowID = selectShowEl.options[selectShowEl.selectedIndex].value;

  if (selectedShowID === "ALL SHOWS") {
    displayAllShows(allShows);
    hideEpisodeSelectionMenu();
  } else {
    currentShow = shows.find((show) => String(show.id) === selectedShowID);
    makeOneBigCurrentShowCard(currentShow);
    getShowEpisodes(currentShow.id);
    showEpisodeSelectionMenu();
    history.pushState(show.id, `selected: ${show.id}`, `/${show.name}`);
  }
}

function makeOneBigCurrentShowCard(show) {
  currentShowCardEl = document.createElement("div");
  rootElem.insertBefore(currentShowCardEl, rootElem.firstChild);
  currentShowCardEl.id = "current-show-card";
  currentShowCardEl.className = "current-show-card";
  currentShowCardEl.innerHTML = `
    <div class="current-show-card-img-container">
      <img class="current-show-card-img" src="${show.image.medium.replace(
        "http",
        "https"
      )}" /></div>
    <div class="show-card-info sm-col-12 md-col-7 lg-col-8 xl-col-9">
      <div class="current-show-card-name-rating-container">
      <h2 class="show-card-name">${show.name} &nbsp;
        <i class="fas fa-star">${show.rating.average}</i>
      </h2> 
      </div>
      <div class="show-card-small-info">
        <li><strong>Genres: </strong>${separateGenres(show.genres)}</li>
        <li><strong>Status: </strong>${show.status}</li>
        <li><strong>Runtime: </strong>${show.runtime}</li>
      </div>
      <p id="show-summary" class="show-summary">${show.summary.replace(
        /<\/?[^>]+(>|$)/g,
        ""
      )}</p>
    </div>
  `;
}

function separateGenres(genres) {
  let allGenres = "";
  genres.forEach((genre) =>
    genre === genres[genres.length - 1]
      ? (allGenres += `${genre}`)
      : (allGenres += `${genre} / `)
  );
  return allGenres;
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

function makePageForEpisodes(episodes) {
  emptyRowEl();
  episodes.forEach((episode) => {
    createEpisodeCode(episode);
    createEpisodeCard(episode);
  });
  displayNumber(episodes, episodes, "Episodes");
}

function createEpisodeCode(episode) {
  episode.code = `S${String(episode.season).padStart(2, 0)}E${String(
    episode.number
  ).padStart(2, 0)}`;
}

function createEpisodeCard(episode) {
  // Create episode container div
  const episodeContainerEl = document.createElement("div");
  rowEl.appendChild(episodeContainerEl);
  episodeContainerEl.className =
    "episode-container col-10 sm-col-8 md-col-6 lg-col-4 xl-col-3";

  // Create episode card's container div
  const cardBodyEl = document.createElement("div");
  episodeContainerEl.appendChild(cardBodyEl);
  cardBodyEl.className = "card-body";

  // Create episode title container div
  const titleContainerEl = document.createElement("div");
  cardBodyEl.appendChild(titleContainerEl);
  titleContainerEl.className = "title-container";

  // Create episode code element (SxxExx) format
  const episodeCodeEl = document.createElement("p");
  titleContainerEl.appendChild(episodeCodeEl);
  episodeCodeEl.className = "episode-code";
  episodeCodeEl.innerText = episode.code;

  // Create episode name element
  const nameEl = document.createElement("h4");
  titleContainerEl.appendChild(nameEl);
  nameEl.className = "episode-name";
  nameEl.innerText = episode.name;

  // Create episode image element
  const imgEl = document.createElement("img");
  cardBodyEl.appendChild(imgEl);
  imgEl.className = "episode-img";
  imgEl.src =
    episode.image !== null
      ? episode.image.medium.replace("http", "https")
      : "https://www.nxp.com/assets/images/en/logos-internal/image-not-available.png";

  // Create episode summary element
  const summaryEl = document.createElement("p");
  cardBodyEl.appendChild(summaryEl);
  summaryEl.className = "episode-summary";
  summaryEl.innerText =
    episode.summary == "" || episode.summary == null
      ? "No Summary Available"
      : episode.summary.replace(/<\/?[^>]+(>|$)/g, "");
}

// Adding show episodes to drop down episode selection menu
function addAllEpisodesToSelectionMenu(episodes) {
  const allEpisodesOption = document.createElement("option");
  selectEpisodeEl.appendChild(allEpisodesOption);
  allEpisodesOption.innerText = "*** ALL EPISODES ***";
  allEpisodesOption.className = "episode-option";
  allEpisodesOption.value = "ALL EPISODES";

  episodes.forEach((episode) => {
    const episodeOption = document.createElement("option");
    selectEpisodeEl.appendChild(episodeOption);
    episodeOption.innerText = `${episode.code} - ${episode.name}`;
    episodeOption.className = "episode-option";
    episodeOption.value = episode.id;
  });

  // Selecting Episodes
  selectEpisodeEl.addEventListener("change", () => {
    moveToEpisode(currentShowEpisodes);
  });
}

function moveToEpisode(episodes) {
  emptyRowEl();
  const selectedEpisodeID =
    selectEpisodeEl.options[selectEpisodeEl.selectedIndex].value;

  if (selectedEpisodeID === "ALL EPISODES") {
    makePageForEpisodes(episodes);
  } else {
    const selectedEpisode = episodes.filter(
      (episode) => String(episode.id) === selectedEpisodeID
    );
    makePageForEpisodes(selectedEpisode);
    displayNumber(selectedEpisode, episodes, "Episodes");
  }
}

// Searching
searchEl.addEventListener("input", () => {
  displayMatchingSearchResults(searchEl.value);
});

function displayMatchingSearchResults(searchInput) {
  emptyRowEl();

  let filteredSearch;

  if (isDisplayingEpisodes) {
    filteredSearch = filterSearchedInEpisodes(currentShowEpisodes, searchInput);
    makePageForEpisodes(filteredSearch);
    highlight(searchInput, ".episode-code");
    highlight(searchInput, ".episode-name");
    highlight(searchInput, ".episode-summary");
    displayNumber(filteredSearch, currentShowEpisodes, "Episodes");
  } else {
    filteredSearch = filterSearchedInShows(allShows, searchInput);
    displayAllShows(filteredSearch);
    highlight(searchInput, ".show-name-link");
    highlight(searchInput, ".show-status");
    highlight(searchInput, ".show-rating");
    highlight(searchInput, ".show-runtime");
    displayNumber(filteredSearch, allShows, "Shows");
  }
  return filteredSearch;
}

function filterSearchedInEpisodes(episodes, searchInput) {
  const filteredEpisodes = episodes.filter(
    (episode) =>
      episode.code.toUpperCase().includes(searchInput.toUpperCase()) ||
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
      show.status.toUpperCase().includes(searchInput.toUpperCase()) ||
      String(show.rating.average).includes(String(searchInput)) ||
      `Runtime: ${show.runtime}`
        .toUpperCase()
        .includes(searchInput.toUpperCase())
  );
  return filteredShows;
}

function highlight(text, targetClass) {
  const targetEl = document.querySelectorAll(targetClass);
  targetEl.forEach((string) => {
    let regex = new RegExp(text, "gi");
    string.innerHTML = string.innerHTML.replace(
      regex,
      (match) => `<span class="highlight">${match}</span>`
    );
  });
}

// Clicking home button (with the TV icon)
document.getElementById("home-btn").addEventListener("click", () => {
  const currentShowCardEl = document.getElementById("current-show-card");

  if (currentShowCardEl != null) {
    currentShowCardEl.remove();
  }
  selectShowEl.value = "ALL SHOWS";
  setup();
});

window.onload = setup;
