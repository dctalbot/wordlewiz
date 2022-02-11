let cache = "";

setInterval(() => {
  const candidate = localStorage.getItem("nyt-wordle-state") || "";
  if (cache !== candidate) {
    // chrome.runtime.sendMessage({ wordleState: JSON.parse(candidate) });
    chrome.storage.local.set({ wordleState: JSON.parse(candidate) });
    cache = candidate;
  }
}, 3000);
