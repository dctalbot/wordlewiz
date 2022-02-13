(()=>{chrome.storage.local.clear();setInterval(()=>{let e=JSON.parse(localStorage.getItem("nyt-wordle-state")||"");e.tick=Date.now(),chrome.storage.local.set({wordleState:e})},1e3);})();
