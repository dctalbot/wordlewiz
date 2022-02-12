import words from "./words.json";

// setInterval(() => {
//   const a = Math.floor(Math.random() * 100);
//   const options = words.slice(a, a + 5);
//   chrome.storage.local.set({ options });
//   console.log(options);
// }, 5000);

// character means correct, set means exclude
const init: (string | Set<string>)[] = new Array(5).fill(new Set());
type LetterMap = typeof init;

setInterval(() => {
  chrome.storage.local
    .get("wordleState")
    .then((val) => console.log(filter(words, update(init, val.wordleState))));
}, 5000);

chrome.storage.onChanged.addListener((store) => {
  const wordleState: WorldleState = store.wordleState?.newValue;

  // chrome.runtime.sendMessage({ options: words });

  const letters = update(init, wordleState);
  console.log(letters);
});

function update(letters: LetterMap, w: WorldleState) {
  if (w.rowIndex === 0) return letters;

  letters.forEach((val, i) => {
    if (typeof i === "string") return;

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

      letters[i] = (letters[i] as Set<string>).add(w.boardState[eIndex][i]);
      eIndex--;
    }
  });

  return letters;
}

function filter(words: string[], letters: LetterMap) {
  const restring = letters.reduce<string>((res, l) => {
    if (typeof l === "string") {
      return res + l;
    }
    if (l.size === 0) {
      return res + "\\w";
    }
    const iter = l.values();
    let x = "[^"; // exclude
    while (!x.endsWith("]")) {
      const val = iter.next().value;
      x += val ? val : "]";
    }
    return res + x;
  }, "");

  const rx = new RegExp(restring);

  return words.filter((w) => rx.test(w));
}
