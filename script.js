const allShows = getAllShows();
const rootElem = document.getElementById("root");
const rowEl = document.getElementById("row");

const selectShowEl = document.getElementById("select-show");
const selectEpisodeEl = document.getElementById("select-episode");
const searchEl = document.getElementById("search");

let currentShow;
let currentShowEpisodes = [];
let isDisplayingEpisodes = false;

function setup() {
  addAllShowsToSelectionMenu(allShows);
  displayAllShows(allShows);
  hideEpisodeSelectionMenu();
}

// Adding shows to drop down show selection menu
function addAllShowsToSelectionMenu(shows) {
  const allShowsOption = createElem("option", selectShowEl, "show-option");
  allShowsOption.innerText = "*** ALL SHOWS ***";
  allShowsOption.value = "ALL SHOWS";

  shows
    .sort((showA, showB) =>
      showA.name.toUpperCase() > showB.name.toUpperCase() ? 1 : -1
    )
    .forEach((show) => {
      const showOption = createElem("option", selectShowEl, "show-option");
      showOption.innerText = show.name;
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
  const showCardContainerEl = createElem(
    "div",
    rowEl,
    "show-card-container sm-col-6 md-col-5 lg-col-4 xl-col-3"
  );

  const showCardBodyEl = createElem(
    "div",
    showCardContainerEl,
    "show-card-body"
  );

  const showImgEl = createElem("img", showCardBodyEl, "show-img");
  showImgEl.src = show.image.medium.replace("http", "https");

  showImgEl.addEventListener("click", () => {
    selectShowEl.value = show.id;
    moveToShow(allShows);
  });

  const showNameEl = createElem("h3", showCardBodyEl, "show-name");
  showNameEl.innerText = show.name;

  const showInfoEl = createElem("div", showCardBodyEl, "show-info");

  const showStatusEl = createElem("p", showInfoEl, "show-status");
  showStatusEl.innerText = `${show.status}`;

  const showRatingEl = createElem("i", showInfoEl, "fas fa-star show-rating");
  showRatingEl.innerText = `${String(show.rating.average)}`;

  const showRuntimeEl = createElem("p", showInfoEl, "show-runtime");
  showRuntimeEl.innerText = `Runtime: ${show.runtime}`;
}

function createElem(tag, parent, cls) {
  const element = document.createElement(tag);
  parent.appendChild(element);
  element.className = cls;
  return element;
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
  removeExistingCurrentShowCard();
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
    // history.pushState(show.id, `selected: ${show.id}`, `/${show.name}`);
  }
}

function makeOneBigCurrentShowCard(show) {
  const currentShowCardEl = document.createElement("div");
  rootElem.insertBefore(currentShowCardEl, rootElem.firstChild);
  currentShowCardEl.className = "current-show-card";
  currentShowCardEl.id = "current-show-card";

  const currentShowCardImgContainer = createElem(
    "div",
    currentShowCardEl,
    "current-show-card-img-container"
  );

  const currentShowCardImg = createElem(
    "img",
    currentShowCardImgContainer,
    "current-show-card-img"
  );
  currentShowCardImg.src = `${show.image.medium.replace("http", "https")}`;

  const currentShowCardInfoContainer = createElem(
    "div",
    currentShowCardEl,
    "show-card-info sm-col-12 md-col-7 lg-col-8 xl-col-9"
  );

  const currentShowCardNameAndRatingContainer = createElem(
    "div",
    currentShowCardInfoContainer,
    "current-show-card-name-rating-container"
  );

  const currentShowCardName = createElem(
    "h2",
    currentShowCardNameAndRatingContainer,
    "show-card-name"
  );
  currentShowCardName.innerText = show.name + " ";

  const currentShowRating = createElem("i", currentShowCardName, "fas fa-star");
  currentShowRating.innerText = show.rating.average;

  const currentShowCardSmallInfo = createElem(
    "div",
    currentShowCardInfoContainer,
    "show-card-small-info"
  );

  const currentShowGenres = createElem("li", currentShowCardSmallInfo, "bold");
  currentShowGenres.innerText = `Genres: ${separateGenres(show.genres)}`;

  const currentShowStatus = createElem("li", currentShowCardSmallInfo, "bold");
  currentShowStatus.innerText = `Status: ${show.status}`;

  const currentShowRuntime = createElem("li", currentShowCardSmallInfo, "bold");
  currentShowRuntime.innerText = `Runtime: ${show.runtime}`;

  const currentShowSummary = createElem(
    "p",
    currentShowCardInfoContainer,
    "show-summary"
  );
  currentShowSummary.id = "show-summary";
  currentShowSummary.innerText = show.summary.replace(/<\/?[^>]+(>|$)/g, "");
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

// Getting show episodes data from the API
function getShowEpisodes(showID) {
  fetch(`https://api.tvmaze.com/shows/${String(showID)}/episodes`)
    .then((response) => response.json())
    .then((data) => {
      currentShowEpisodes = data;
      makePageForEpisodes(currentShowEpisodes);
      addAllEpisodesToSelectionMenu(currentShowEpisodes);
    })
    .catch((error) => alert("Oops something went wrong" + error));
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
  const episodeContainerEl = createElem(
    "div",
    rowEl,
    "episode-container col-10 sm-col-8 md-col-6 lg-col-4 xl-col-3"
  );

  const cardBodyEl = createElem("div", episodeContainerEl, "card-body");

  const titleContainerEl = createElem("div", cardBodyEl, "title-container");

  const episodeCodeEl = createElem("p", titleContainerEl, "episode-code");
  episodeCodeEl.innerText = episode.code;

  const nameEl = createElem("h4", titleContainerEl, "episode-name");
  nameEl.innerText = episode.name;

  const imgEl = createElem("img", cardBodyEl, "episode-img");
  imgEl.src =
    episode.image !== null
      ? episode.image.medium.replace("http", "https")
      : "https://www.nxp.com/assets/images/en/logos-internal/image-not-available.png";

  const summaryEl = createElem("p", cardBodyEl, "episode-summary");
  summaryEl.innerText =
    episode.summary == "" || episode.summary == null
      ? "No Summary Available"
      : episode.summary.replace(/<\/?[^>]+(>|$)/g, "");
}

// Adding show episodes to drop down episode selection menu
function addAllEpisodesToSelectionMenu(episodes) {
  const allEpisodesOption = createElem(
    "option",
    selectEpisodeEl,
    "episode-option"
  );
  allEpisodesOption.innerText = "*** ALL EPISODES ***";
  allEpisodesOption.value = "ALL EPISODES";

  episodes.forEach((episode) => {
    const episodeOption = createElem(
      "option",
      selectEpisodeEl,
      "episode-option"
    );
    episodeOption.innerText = `${episode.code} - ${episode.name}`;
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
  const targetEls = document.querySelectorAll(targetClass);
  targetEls.forEach((targetEl) => {
    let regex = new RegExp(text, "gi");
    targetEl.innerHTML = targetEl.innerHTML.replace(
      regex,
      (match) => `<span class="highlight">${match}</span>`
    );
  });
}

// Clicking home button (with the TV icon)
document.getElementById("home-btn").addEventListener("click", () => {
  removeExistingCurrentShowCard();
  selectShowEl.value = "ALL SHOWS";
  setup();
});

function removeExistingCurrentShowCard() {
  const currentShowCardEl = document.getElementById("current-show-card");
  if (currentShowCardEl != null) {
    currentShowCardEl.remove();
  }
}

window.onload = setup;
