const allShows = getAllShows();
const rootElem = document.getElementById("root");

function setup() {
  // const allEpisodes = getAllEpisodes();
  // makePageForEpisodes(allEpisodes);
  addAllShows(allShows);

  // Get shows data
}

function makePageForEpisodes(episodes) {
  episodes.forEach((episode) => {
    createEpisodeCode(episode);
    createEpisodeCard(episode);
  });
  displayNumOfEpisodes(episodes, episodes);
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
  if (episode.image !== null) {
    imgEl.className = "image-medium";
    imgEl.src = episode.image.medium.replace("http", "https");
  }

  // Create episode summary element
  const summaryEl = document.createElement("p");
  episodeContainerEl.appendChild(summaryEl);
  summaryEl.innerHTML = episode.summary;
  summaryEl.className = "summary";
  // .replace("<p>", "")
  // .replace("</p>", "");

  // rootElem.innerHTML += `
  // <div class="episode-container">
  //   <div class="title-container">
  //     <p class="season-episode-num">${episode.se}</p>
  //     <h3 class="name">${episode.name}</h3>
  //   </div>
  //   <script>
  //   if (episode.image != null) {
  //     <img src="${episode.image.medium.replace("http", "https")}" />
  //   }
  //   </script>
  //   <p class="summary">${episode.summary}</p>
  // </div>
  // `;
}

function displayNumOfEpisodes(array1, array2) {
  document.querySelector(
    ".display"
  ).textContent = `Displaying:${array1.length}/${array2.length}`;
}

function emptyRootElement() {
  document.getElementById("root").innerHTML = "";
}

// Searching
const searchElm = document.getElementById("search");
searchElm.addEventListener("input", () => {
  displaySearchInput(currentShowEpisodes);
  // highlightSearchTerm(e);
});

function displaySearchInput(episodes) {
  const filteredEpisodes = filterSearchedEpisodes(episodes, searchElm.value);

  emptyRootElement();
  makePageForEpisodes(filteredEpisodes);
  displayNumOfEpisodes(filteredEpisodes, episodes);

  // HIGHLIGHTING ATTEMPT:
  // const searchTerm = searchElm.value;
  // if (filteredEpisodes.includes(searchTerm)) {
  //   searchTerm.style.color = "red";
  // }
}

function filterSearchedEpisodes(episodes, searchInput) {
  const filteredEpisodes = episodes.filter(
    (episode) =>
      episode.se.toUpperCase().includes(searchInput.toUpperCase()) ||
      episode.name.toUpperCase().includes(searchInput.toUpperCase()) ||
      episode.summary.toUpperCase().includes(searchInput.toUpperCase())
  );
  return filteredEpisodes;
}

// function highlightSearchTerm(searchTerm) {
//   searchTerm.style.backgroundColor = "red";
// }

function addAllEpisodesToSelection(episodes) {
  episodes.forEach((episode) => {
    const episodeOptionEl = document.createElement("option");
    episodeSelectEl.appendChild(episodeOptionEl);
    episodeOptionEl.textContent = `${episode.se} - ${episode.name}`;
  });
}
// Selecting Episodes
const episodeSelectEl = document.getElementById("select-episode");

// Show Selected episode
episodeSelectEl.addEventListener("change", () => {
  moveToEpisode(currentShowEpisodes);
});

function moveToEpisode(episodes) {
  emptyRootElement();
  const selectedTerm = episodeSelectEl.value;

  if (selectedTerm === "=== All Episodes ===") {
    makePageForEpisodes(episodes);
  } else {
    const selectedEpisode = episodes.filter((episode) =>
      selectedTerm.includes(episode.se)
    );
    makePageForEpisodes(selectedEpisode);
    displayNumOfEpisodes(selectedEpisode, episodes);
  }
}

// function selectEpisode(episodes, option) {
//   const selectedEpisode = episodes.find((episode) => {
//     option.includes(episode.se);
//   });
//   return selectedEpisode;
// }

// Adding shows to select menu
const selectShow = document.getElementById("select-show");

function addAllShows(shows) {
  shows
    .sort((showA, showB) =>
      showA.name.toUpperCase() > showB.name.toUpperCase() ? 1 : -1
    )
    .forEach((show) => {
      const showOption = document.createElement("option");
      selectShow.appendChild(showOption);
      showOption.textContent = show.name;
      // showOption.value = show.id;
    });
}

// Selecting a show
// let currentShow;

selectShow.addEventListener("change", () => {
  moveToShow(allShows);
});

function moveToShow(shows) {
  document.getElementById("root").innerHTML = "";
  document.getElementById("select-episode").innerHTML = "";

  const allEpisodesOption = document.createElement("option");
  episodeSelectEl.appendChild(allEpisodesOption);
  allEpisodesOption.textContent = "=== All Episodes ===";

  const selectedShow = shows.find((show) => show.name === selectShow.value);
  getShowEpisodes(selectedShow.id);
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
      console.log(currentShowEpisodes);
      makePageForEpisodes(currentShowEpisodes);
      addAllEpisodesToSelection(currentShowEpisodes);
    })
    .catch((error) => console.log(error));
}

window.onload = setup;
