function setOptions(options: string[]) {
  const ol = document.querySelector("ol");

  var next = document.createElement("ol");
  options.forEach((o) => {
    const li = document.createElement("li");
    li.appendChild(document.createTextNode(o));
    next.appendChild(li);
  });

  ol?.replaceWith(next);
}

const ch = new BroadcastChannel("optionsCh");

ch.onmessage = (msg) => {
  setOptions(msg?.data?.options ?? []);
};
