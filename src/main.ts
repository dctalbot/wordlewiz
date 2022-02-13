// main.ts executes on page load

chrome.storage.local.clear();

// there isn't a good way to watch localStorage, so poll it
setInterval(() => {
  const wordleState = JSON.parse(
    localStorage.getItem("nyt-wordle-state") || ""
  );
  wordleState.tick = Date.now();
  chrome.storage.local.set({ wordleState });
}, 1000);
