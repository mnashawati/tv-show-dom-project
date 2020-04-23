//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

// rootElem.textContent = `Got ${episode.length} episode(s)`;

function createEpisodeCard(episode) {
  const rootElem = document.getElementById("root");

  const episodeContainer = document.createElement("div");
  episodeContainer.className = "episode-container";
  rootElem.appendChild(episodeContainer);

  const titleContainer = document.createElement("div");
  titleContainer.className = "title-container";
  episodeContainer.appendChild(titleContainer);

  const titleElm = document.createElement("h3");
  titleElm.className = "title";
  titleContainer.appendChild(titleElm);

  const episodeName = episode.name;
  const episodeNumber = `S${String(episode.season).padStart(2, 0)}E${String(
    episode.number
  ).padStart(2, 0)}`;
  titleElm.textContent = `${episodeName} - ${episodeNumber}`;

  const imgElm = document.createElement("img");
  episodeContainer.appendChild(imgElm);
  imgElm.src = episode.image.medium.replace("http", "https");

  const summaryElm = document.createElement("p");
  episodeContainer.appendChild(summaryElm);
  summaryElm.className = "summary";
  summaryElm.innerHTML = episode.summary.replace("<p>", "").replace("</p>", "");
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
  document.getElementById("root").innerHTML = "";

  const allEpisodes = getAllEpisodes();
  const filteredEpisodes = filterSearch(allEpisodes, searchElm.value);

  makePageForEpisodes(filteredEpisodes);
  displayingNumOfEpisodes(filteredEpisodes, allEpisodes);
});

function filterSearch(episodes, searchInput) {
  const searchResults = episodes.filter(
    (episode) =>
      episode.name.toUpperCase().includes(searchInput.toUpperCase()) ||
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
