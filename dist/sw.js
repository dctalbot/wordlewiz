(() => {
  // src/sw.ts
  var init = new Array(5).fill(/* @__PURE__ */ new Set());
  setInterval(() => {
    chrome.storage.local.get("wordleState").then((val) => console.log(update(init, val.wordleState)));
  }, 5e3);
  chrome.storage.onChanged.addListener((store) => {
    const wordleState = store.wordleState?.newValue;
    const letters = update(init, wordleState);
    console.log(letters);
  });
  function update(letters, w) {
    if (w.rowIndex === 0)
      return letters;
    letters.forEach((val, i) => {
      if (typeof i === "string")
        return;
      let eIndex = 5;
      while (eIndex >= 0) {
        const row = w.evaluations[eIndex];
        if (row === null) {
          eIndex--;
          continue;
        }
        if (row[i] === "correct") {
          letters[i] = w.boardState[eIndex][i];
          break;
        }
        letters[i] = letters[i].add(w.boardState[eIndex][i]);
        eIndex--;
      }
    });
    return letters;
  }
})();
