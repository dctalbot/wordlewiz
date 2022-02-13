import words from "./words.json";

const ch = new BroadcastChannel("optionsCh");

function getOptions(ws: WorldleState): string[] {
  if (!ws) return words;

  // char means correct, set means exclude
  const soln = new Array<string | Set<string>>(5).fill(new Set());
  const includes = new Set<string>();
  const excludes = new Set<string>();

  ws.evaluations.forEach((e, ei) => {
    if (!e) return;
    e.forEach((term, ti) => {
      const char = ws.boardState[ei][ti];
      switch (term) {
        case "correct":
          soln[ti] = char;
          break;
        case "present":
          includes.add(char);
          if (typeof soln[ti] !== "string") {
            soln[ti] = new Set([...soln[ti], char]);
          }
          break;
        case "absent":
          excludes.add(char);
          break;
      }
    });
  });

  let pattern = "";
  soln.forEach((s) => {
    if (typeof s === "string") {
      pattern += s;
      return;
    }
    if (s.size === 0) {
      pattern += "[a-z]";
      return;
    }
    pattern += `[^${[...s].join("")}]`;
  });

  const rx = new RegExp(pattern);

  return words.filter((w) => {
    let iter = includes.values();
    let val = iter.next().value;
    while (val) {
      if (!w.includes(val)) return false;
      val = iter.next().value;
    }
    iter = excludes.values();
    val = iter.next().value;
    while (val) {
      if (w.includes(val)) return false;
      val = iter.next().value;
    }
    return rx.test(w);
  });
}

chrome.storage.onChanged.addListener((store) => {
  const state: WorldleState = store.wordleState?.newValue;

  // new game
  if (!state || state.rowIndex == 0) {
    ch.postMessage({ options: words });
    return;
  }

  ch.postMessage({ options: getOptions(state) });
});
