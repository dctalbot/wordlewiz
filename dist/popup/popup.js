(() => {
  // src/popup/popup.ts
  function setOptions(options) {
    const ol = document.querySelector("ol");
    var next = document.createElement("ol");
    options.forEach((o) => {
      const li = document.createElement("li");
      li.appendChild(document.createTextNode(o));
      next.appendChild(li);
    });
    ol?.replaceWith(next);
  }
  var ch = new BroadcastChannel("optionsCh");
  ch.postMessage({ type: "awake" });
  ch.onmessage = (msg) => {
    setOptions(msg?.data?.options ?? []);
  };
})();
