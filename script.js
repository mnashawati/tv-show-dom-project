//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

// rootElem.textContent = `Got ${episode.length} episode(s)`;

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

function makePageForEpisodes(episodes) {
  episodes.forEach((episode) => {
    createEpisodeCard(episode);
  });
  displayingNumOfEpisodes(episodes, episodes);
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
});

function filterSearch(episodes, searchInput) {
  const searchResults = episodes.filter(
    (episode) =>
      episode.name.toUpperCase().includes(searchInput.toUpperCase()) ||
      episode.se.toUpperCase().includes(searchInput.toUpperCase()) ||
      episode.summary.toUpperCase().includes(searchInput.toUpperCase())
  );
  return searchResults;
}

function displayingNumOfEpisodes(array1, array2) {
  document.querySelector(
    ".display"
  ).textContent = `Displaying: ${array1.length}/${array2.length}`;
}

window.onload = setup;
