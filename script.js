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
    episodeContainer.className = "column";
    rootElem.appendChild(episodeContainer);

    let episodeName = episode.name;
    let episodeNumber = `S${String(episode.season).padStart(2, 0)} - E${String(
      episode.number
    ).padStart(2, 0)}`;
    let episodeImage = episode.image.medium;
    let episodeSummery = episode.summary;

    let h1Elm = document.createElement("h1");
    episodeContainer.appendChild(h1Elm);
    h1Elm.textContent = episodeName;

    let h2Elm = document.createElement("h2");
    episodeContainer.appendChild(h2Elm);
    h2Elm.textContent = episodeNumber;

    let img = document.createElement("img");
    episodeContainer.appendChild(img);
    img.src = episodeImage;

    let summery = document.createElement("div");
    episodeContainer.appendChild(summery);
    // summery.children.className = "summery";
    summery.innerHTML = episodeSummery;
  });
}

window.onload = setup;
