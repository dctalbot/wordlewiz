(() => {
  // src/main.ts
  var cache = "";
  setInterval(() => {
    const candidate = localStorage.getItem("nyt-wordle-state") || "";
    if (cache !== candidate) {
      chrome.storage.local.set({ wordleState: JSON.parse(candidate) });
      cache = candidate;
    }
  }, 3e3);
})();
