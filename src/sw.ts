import words from "./words.json";

setInterval(() => {
  const a = Math.floor(Math.random() * 100);
  const options = words.slice(a, a + 5);
  chrome.storage.local.set({ options });
  console.log(options);
}, 5000);

let wordleState = {};

chrome.storage.onChanged.addListener((store) => {
  wordleState = store.wordleState?.newValue ?? wordleState;

  chrome.runtime.sendMessage({ options: words });
});
