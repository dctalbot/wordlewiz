import words from "./words.json";

const ch = new BroadcastChannel("optionsCh");

function getSummary(ws: WorldleState) {
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

  return {
    soln,
    includes,
    excludes,
  };
}

function getPattern(soln: (string | Set<string>)[]) {
  let res = "";
  soln.forEach((s) => {
    if (typeof s === "string") {
      res += s;
      return;
    }
    if (s.size === 0) {
      res += ".";
      return;
    }
    res += `[^${[...s].join("")}]`;
  });
  return res;
}

function getOptions(ws: WorldleState): string[] {
  const { soln, includes, excludes } = getSummary(ws);
  const pattern = getPattern(soln);
  const re = new RegExp(pattern);

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
    return re.test(w);
  });
}

chrome.storage.onChanged.addListener((store) => {
  const ws: WorldleState = store.wordleState?.newValue;

  // new game
  if (!ws || ws.rowIndex == 0) {
    ch.postMessage({ options: words });
    return;
  }

  ch.postMessage({ options: getOptions(ws) });
});
