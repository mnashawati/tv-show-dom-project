function setup() {
  // const allEpisodes = getAllEpisodes();
  // makePageForEpisodes(allEpisodes);
  const allShows = getAllShows();
  addAllShows(allShows);
}

const rootElem = document.getElementById("root");

function makePageForEpisodes(episodes) {
  createEpisodeCodes(episodes);
  displayNumOfEpisodes(episodes, episodes);

  episodes.forEach((episode) => {
    createEpisodeCard(episode);
  });
}

function createEpisodeCard(episode) {
  rootElem.innerHTML += `
  <div class="episode-container">
  <div class="title-container">
  <p class="season-episode-num">
  ${episode.se}
  </p>
  <h3 class="name">${episode.name}</h3>
  </div>
  <img src="${episode.image.medium}" /> 
  <p class="summary">${episode.summary}</p>
  </div>
  `;
}

function createEpisodeCodes(episodes) {
  episodes.forEach((episode) => {
    episode.se = `S${String(episode.season).padStart(2, 0)}E${String(
      episode.number
    ).padStart(2, 0)}`;
  });
}

// Searching
const searchElm = document.getElementById("search");

searchElm.addEventListener("input", (e) => {
  displaySearchInput(currentShowEpisodes);
  highlightSearchTerm(e);
});

function displaySearchInput(episodes) {
  const filteredEpisodes = filterSearchedEpisodes(episodes, searchElm.value);
  document.getElementById("root").innerHTML = "";

  makePageForEpisodes(filteredEpisodes);
  displayNumOfEpisodes(filteredEpisodes, episodes);

  // HIGHLIGHTING ATTEMPT:
  // const searchTerm = searchElm.value;
  // if (filteredEpisodes.includes(searchTerm)) {
  //   searchTerm.style.color = "red";
  // }
}

function filterSearchedEpisodes(episodes, searchInput) {
  const filteredResults = episodes.filter(
    (episode) =>
      episode.se.toUpperCase().includes(searchInput.toUpperCase()) ||
      episode.name.toUpperCase().includes(searchInput.toUpperCase()) ||
      episode.summary.toUpperCase().includes(searchInput.toUpperCase())
  );
  return filteredResults;
}

function highlightSearchTerm(searchTerm) {
  searchTerm.style.backgroundColor = "red";
}

function displayNumOfEpisodes(array1, array2) {
  document.querySelector(
    ".display"
  ).textContent = `Displaying: ${array1.length}/${array2.length}`;
}

// Selecting Episodes
function addAllEpisodesToSelection(episodes) {
  const episodeSelectEl = document.getElementById("episode-select");

  episodes.forEach((episode) => {
    const episodeOptionEl = document.createElement("option");
    episodeSelectEl.appendChild(episodeOptionEl);
    episodeOptionEl.textContent = `${episode.se} - ${episode.name}`;
  });
  // Show Selected episode
  episodeSelectEl.addEventListener("change", moveToEpisode);
  function moveToEpisode() {
    document.getElementById("root").innerHTML = "";
    const selectedTerm = episodeSelectEl.value;

    if (selectedTerm === "=== All Episodes ===") {
      makePageForEpisodes(episodes);
      displayNumOfEpisodes(episodes, episodes);
    } else {
      const selectedEpisode = episodes.filter((episode) =>
        selectedTerm.includes(episode.se)
      );
      makePageForEpisodes(selectedEpisode);
      displayNumOfEpisodes(selectedEpisode, episodes);
    }
  }
}

// function selectEpisode(episodes, option) {
//   const selectedEpisode = episodes.find((episode) => {
//     option.includes(episode.se);
//   });
//   return selectedEpisode;
// }

// Adding shows to select menu
function addAllShows(shows) {
  const selectShow = document.getElementById("show-select");
  shows
    .sort((showA, showB) =>
      showA.name.toUpperCase() > showB.name.toUpperCase() ? 1 : -1
    )
    .forEach((show) => {
      const showOption = document.createElement("option");
      selectShow.appendChild(showOption);
      showOption.textContent = show.name;
    });

  // Selecting a show
  let currentShow = [];

  selectShow.addEventListener("change", moveToShow);
  function moveToShow() {
    document.getElementById("root").innerHTML = "";

    const episodeSelectEl = document.getElementById("episode-select");
    episodeSelectEl.innerHTML = "";

    const allEpisodesOption = document.createElement("option");
    episodeSelectEl.appendChild(allEpisodesOption);
    allEpisodesOption.textContent = "=== All Episodes ===";

    const selectedShow = shows.find((show) => show.name === selectShow.value);
    currentShow.push(selectedShow);
    // console.log(currentShow);
    getShowEpisodes(selectedShow.id);
  }
}

// Fetching show episodes API
let currentShowEpisodes = [];
let api_url = `https://api.tvmaze.com/shows/[SHOW-ID]/episodes`;
function getShowEpisodes(showID) {
  let selectedApiUrl = api_url.replace("[SHOW-ID]", String(showID));
  fetch(selectedApiUrl)
    .then((response) => response.json())
    .then((data) => {
      currentShowEpisodes = data;
      makePageForEpisodes(currentShowEpisodes);
      addAllEpisodesToSelection(currentShowEpisodes);
    });
  // .catch((error) => console.log(error));
}

window.onload = setup;

// const episodeContainerEl = document.createElement("div");
// rootElem.appendChild(episodeContainerEl);
// episodeContainerEl.className = "episode-container";

// const titleContainerEl = document.createElement("div");
// episodeContainerEl.appendChild(titleContainerEl);
// titleContainerEl.className = "title-container";

// const seasonAndEpisodeNumEl = document.createElement("p");
// titleContainerEl.appendChild(seasonAndEpisodeNumEl);
// seasonAndEpisodeNumEl.className = "season-episode-num";
// seasonAndEpisodeNumEl.textContent = `S${String(episode.season).padStart(
//   2,
//   0
// )}E${String(episode.number).padStart(2, 0)}`;
// episode.se = seasonAndEpisodeNumEl.textContent;

// const nameEl = document.createElement("h3");
// titleContainerEl.appendChild(nameEl);
// nameEl.className = "name";
// nameEl.textContent = episode.name;

// const imgEl = document.createElement("img");
// imgEl.src = episode.image["medium"];
// episodeContainerEl.appendChild(imgEl);
// // .replace("http", "https");

// const summaryEl = document.createElement("p");
// episodeContainerEl.appendChild(summaryEl);
// summaryEl.className = "summary";
// summaryEl.innerHTML = episode.summary;
// // .replace("<p>", "")
// // .replace("</p>", "");

// rootElem.innerHTML += `<div class="episode-container">
//   <div class="title-container">
//     <p class="season-episode-num" id="se">
//       S${String(episode.season).padStart(2, 0)}E${String(
//   episode.number
// ).padStart(2, 0)}
//     </p>
//     <h3 class="name">${episode.name}</h3>
//   </div>
//   <img src="${episode.image.medium}"/>
//   <p class="summary">${episode.summary}</p>
// </div>
// `;
// episode.se = document.getElementById("season-episode-num").textContent;
