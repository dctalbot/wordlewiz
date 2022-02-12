import words from "./words.json";

const ch = new BroadcastChannel("optionsCh");

// character means correct, set means exclude
const init: (string | Set<string>)[] = new Array(5).fill(new Set());
type LetterMap = typeof init;

chrome.storage.onChanged.addListener((store) => {
  const wordleState: WorldleState = store.wordleState?.newValue;
  const options = filter(words, update(init, wordleState));
  ch.postMessage({ options });
});

function update(letters: LetterMap, w: WorldleState) {
  if (w === undefined) return letters;
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
