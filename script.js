//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episode) {
  const rootElem = document.getElementById("root");
  // rootElem.textContent = `Got ${episode.length} episode(s)`;

  episode.forEach((episode) => {
    let episodeContainer = document.createElement("div");
    episodeContainer.className = "episode-container";
    rootElem.appendChild(episodeContainer);

    let episodeName = episode.name;
    let episodeNumber = `S${String(episode.season).padStart(2, 0)}E${String(
      episode.number
    ).padStart(2, 0)}`;
    let episodeImage = episode.image.medium.replace("http", "https");
    let episodeSummary = episode.summary.replace("<p>", "").replace("</p>", "");

    let titleContainer = document.createElement("div");
    episodeContainer.appendChild(titleContainer);
    titleContainer.className = "title-container";

    let titleElm = document.createElement("h3");
    titleContainer.appendChild(titleElm);
    titleElm.textContent = `${episodeName} - ${episodeNumber}`;
    titleElm.className = "title";

    let img = document.createElement("img");
    episodeContainer.appendChild(img);
    img.src = episodeImage;

    let summary = document.createElement("p");
    episodeContainer.appendChild(summary);
    summary.innerHTML = episodeSummary;
    summary.className = "summary";
  });
}

window.onload = setup;
