const allShows = getAllShows();
const rootElem = document.getElementById("root");
const rowEl = document.getElementById("row");
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
  searchElm.placeholder = "Search Shows...";
}

function showEpisodeSelectionMenu() {
  selectEpisodeEl.style.display = "initial";
  isDisplayingEpisodes = true;
  searchElm.placeholder = "Search Episodes...";
}

function setup() {
  addAllShowsToSelectionMenu(allShows);
  displayAllShows(allShows);
  hideEpisodeSelectionMenu();
}

function makePageForEpisodes(episodes) {
  emptyRowElem();
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
  episodeCodeEl.textContent = episode.code;

  // Create episode name element
  const nameEl = document.createElement("h4");
  titleContainerEl.appendChild(nameEl);
  nameEl.className = "episode-name";
  nameEl.textContent = episode.name;

  // Create episode image element
  const imgEl = document.createElement("img");
  cardBodyEl.appendChild(imgEl);
  imgEl.className = "episode-img";
  imgEl.src =
    episode.image !== null ? episode.image.medium.replace("http", "https") : "";

  // Create episode summary element
  const summaryEl = document.createElement("p");
  cardBodyEl.appendChild(summaryEl);
  summaryEl.className = "episode-summary";
  summaryEl.innerText =
    episode.summary !== null
      ? episode.summary.replace(/<\/?[^>]+(>|$)/g, "")
      : "No Summary Available";
}

function displayNumber(array1, array2, type) {
  document.querySelector(
    ".display"
  ).textContent = `Displaying:${array1.length}/${array2.length} ${type}`;
}

function emptyRowElem() {
  document.getElementById("row").innerHTML = "";
}

// Searching
searchElm.addEventListener("input", () => {
  displayMatchingSearchResults(searchElm.value);
  // highlightSearchTerm(e);
});

function displayMatchingSearchResults(searchInput) {
  emptyRowElem();

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

function highlight(text, targetClass) {
  const targetEl = document.querySelectorAll(targetClass);
  targetEl.forEach((string) => {
    let regex = new RegExp(text, "gi");
    string.innerHTML = string.innerHTML.replace(
      regex,
      `<span class="highlight">${text}</span>`
    );
  });
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
      // show.summary.toUpperCase().includes(searchInput.toUpperCase()) ||
      // separateGenres(show.genres)
      show.status.toUpperCase().includes(searchInput.toUpperCase()) ||
      String(show.rating.average).includes(String(searchInput)) ||
      `Runtime: ${show.runtime}`
        .toUpperCase()
        .includes(searchInput.toUpperCase())
  );
  return filteredShows;
}

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
    episodeOption.textContent = `${episode.code} - ${episode.name}`;
    episodeOption.className = "episode-option";
    episodeOption.id = episode.id;
  });
}

// Selecting Episodes
selectEpisodeEl.addEventListener("change", () => {
  moveToEpisode(currentShowEpisodes);
});

function moveToEpisode(episodes) {
  emptyRowElem();
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
  const currentShowCardEl = document.getElementById("current-show-card");
  if (currentShowCardEl != null) {
    currentShowCardEl.remove();
  }
  emptyRowElem();
  document.getElementById("select-episode").innerHTML = "";

  const selectedShowID = selectShowEl.options[selectShowEl.selectedIndex].id;

  if (selectedShowID === "ALL SHOWS") {
    displayAllShows(allShows);
    hideEpisodeSelectionMenu();
  } else {
    currentShow = shows.find((show) => String(show.id) === selectedShowID);
    makeOneBigCurrentShowCard(currentShow);
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
    genre === genres[genres.length - 1]
      ? (allGenres += `${genre}`)
      : (allGenres += `${genre} / `)
  );
  return allGenres;
}

function createShowCard(show) {
  // const separatedGenres = separateGenres(show.genres);
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

  // const showNameEl = document.createElement("div");
  // showCardBodyEl.appendChild(showNameEl);
  // showNameEl.className = "show-name-container";
  // showNameEl.textContent = show.name;

  const showNameLink = document.createElement("h3");
  showCardBodyEl.appendChild(showNameLink);
  showNameLink.className = "show-name-link";
  showNameLink.textContent = show.name;

  showImgEl.addEventListener("click", () => {
    selectShowEl.value = showNameLink.innerText;
    moveToShow(allShows);
  });

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

function displayAllShows(shows) {
  emptyRowElem();
  shows.forEach((show) => {
    createShowCard(show);
  });
  displayNumber(allShows, allShows, "Shows");
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
