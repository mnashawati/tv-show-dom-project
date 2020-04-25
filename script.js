//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
  const allShows = getAllShows();
  addAllShows(allShows);
}

// rootElem.textContent = `Got ${episode.length} episode(s)`;

function makePageForEpisodes(episodes) {
  episodes.forEach((episode) => {
    createEpisodeCard(episode);
  });
  displayingNumOfEpisodes(episodes, episodes);
}

function createEpisodeCard(episode) {
  const rootElem = document.getElementById("root");

  const episodeContainerEl = document.createElement("div");
  rootElem.appendChild(episodeContainerEl);
  episodeContainerEl.className = "episode-container";

  const titleContainerEl = document.createElement("div");
  episodeContainerEl.appendChild(titleContainerEl);
  titleContainerEl.className = "title-container";

  const seasonAndEpisodeNumEl = document.createElement("p");
  titleContainerEl.appendChild(seasonAndEpisodeNumEl);
  seasonAndEpisodeNumEl.className = "season-episode-num";
  seasonAndEpisodeNumEl.textContent = `S${String(episode.season).padStart(
    2,
    0
  )}E${String(episode.number).padStart(2, 0)}`;
  episode.se = seasonAndEpisodeNumEl.textContent;

  const nameEl = document.createElement("h3");
  titleContainerEl.appendChild(nameEl);
  nameEl.className = "name";
  nameEl.textContent = episode.name;


  const imgEl = document.createElement("img");
  episodeContainerEl.appendChild(imgEl);
  imgEl.src = episode.image.medium.replace("http", "https");

  const summaryEl = document.createElement("p");
  episodeContainerEl.appendChild(summaryEl);
  summaryEl.className = "summary";
  summaryEl.innerHTML = episode.summary.replace("<p>", "").replace("</p>", "");
}

// Level 200
const searchElm = document.getElementById("search");

searchElm.addEventListener("input", () => {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);

  const filteredEpisodes = filterSearch(allEpisodes, searchElm.value);
  document.getElementById("root").innerHTML = "";

  makePageForEpisodes(filteredEpisodes);
  displayingNumOfEpisodes(filteredEpisodes, allEpisodes);

  // HIGHLIGHTING ATTEMPT:
  // const searchTerm = searchElm.value;
  // if (filteredEpisodes.includes(searchTerm)) {
  //   searchTerm.style.color = "red";
  // }
});

function filterSearch(episodes, searchInput) {
  const filteredResults = episodes.filter(
    (episode) =>
      episode.name.toUpperCase().includes(searchInput.toUpperCase()) ||
      episode.se.toUpperCase().includes(searchInput.toUpperCase()) ||
      episode.summary.toUpperCase().includes(searchInput.toUpperCase())
  );
  return filteredResults;
}

function displayingNumOfEpisodes(array1, array2) {
  document.querySelector(
    ".display"
  ).textContent = `Displaying: ${array1.length}/${array2.length}`;
}

// Selecting Episodes
const episodeSelectEl = document.getElementById("episode-select");

function addAllEpisodesToSelection(episodes) {
  episodes.forEach((episode) => {
    const episodeOptionEl = document.createElement("option");
    episodeOptionEl.textContent = `${episode.se} - ${episode.name}`;
    episodeSelectEl.appendChild(episodeOptionEl);
  });
}

episodeSelectEl.addEventListener("change", () => {
  // console.log(episodeSelectEl.value);
  const selectedTerm = episodeSelectEl.value;
  document.getElementById("root").innerHTML = "";
  if (selectedTerm === "All Episodes") {
    makePageForEpisodes(allEpisodes);
  } else {
    const selectedEpisode = allEpisodes.filter((episode) =>
      selectedTerm.includes(episode.name)
    );
    // console.log(selectedEpisode);
    makePageForEpisodes(selectedEpisode);
  }
});

// function selectEpisode(episodes, option) {
//   const selectedEpisode = episodes.find((episode) => {
//     option.includes(episode.se);
//   });
//   return selectedEpisode;
// }

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
  selectShow.addEventListener("change", moveToShow);
  function moveToShow() {
    document.getElementById("episode-select").innerHTML = "";
    document.getElementById("root").innerHTML = "";
    shows.forEach((show) => {
      if (selectShow.value === show.name) {
        let allShowEpisodes = getShowEpisodes(show.id);
        console.log(allShowEpisodes);
        // makePageForEpisodes(allShowEpisodes);
      }
    });
  }
}

const api_url = `https://api.tvmaze.com/shows/[SHOW-ID]/episodes`;
function getShowEpisodes(showID) {
  let selectedApiUrl = api_url.replace("[SHOW-ID]", String(showID));
  fetch(selectedApiUrl)
    .then((response) => response.json())
    .then((data) => {
      makePageForEpisodes(data);
      addAllEpisodesToSelection(data);
    });
  // const data = await response.json();
  // console.log(Array.from(data));
  // console.log(selectedApiUrl);
  // return Array.from(data);
  // console.log(data);
  // console.log(typeof data);
  // return data;
}

window.onload = setup;
