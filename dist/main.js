(() => {
  // src/main.ts
  chrome.storage.local.clear();
  setInterval(() => {
    const wordleState = JSON.parse(localStorage.getItem("nyt-wordle-state") || "");
    wordleState.tick = Date.now();
    chrome.storage.local.set({ wordleState });
  }, 3e3);
})();
